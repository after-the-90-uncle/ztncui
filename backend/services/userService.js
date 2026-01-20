/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const fs = require('fs');
const argon2 = require('argon2');
const util = require('util');
const config = require('../config');
const { createError } = require('../middleware/errorHandler');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const chmod = util.promisify(fs.chmod);

let _users = null;

/**
 * 用户服务
 */
class UserService {
  constructor() {
    this.passwdFile = config.files.passwd;
    this.minPasswordLength = config.user.minPasswordLength;
  }

  /**
   * 读取用户数据
   * @returns {Promise<Array>} 用户列表
   */
  async getUsers() {
    if (_users) {
      return _users;
    }

    try {
      const data = await readFile(this.passwdFile, 'utf8');
      _users = JSON.parse(data);
      return _users;
    } catch (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，创建默认admin用户
        await this.createDefaultAdmin();
        return await this.getUsers();
      }
      throw createError('读取用户数据失败: ' + err.message, 500, 'USER_READ_ERROR');
    }
  }

  /**
   * 创建默认管理员用户
   */
  async createDefaultAdmin() {
    const defaultAdmin = {
      name: 'admin',
      hash: await argon2.hash('password'),
      isAdmin: true,
      pass_set: false,
      createdAt: new Date().toISOString()
    };

    await this.updateUsers([defaultAdmin]);
  }

  /**
   * 更新用户数据
   * @param {Array} users - 用户列表
   * @returns {Promise<Array>} 更新后的用户列表
   */
  async updateUsers(users) {
    try {
      await writeFile(this.passwdFile, JSON.stringify(users, null, 2), 'utf8');
      await chmod(this.passwdFile, 0o600);
      _users = null; // 清除缓存
      return await this.getUsers();
    } catch (err) {
      throw createError('更新用户数据失败: ' + err.message, 500, 'USER_UPDATE_ERROR');
    }
  }

  /**
   * 根据用户名查找用户
   * @param {string} name - 用户名
   * @returns {Promise<Object|null>} 用户信息
   */
  async findUserByName(name) {
    const users = await this.getUsers();
    return users.find(user => user.name === name) || null;
  }

  /**
   * 验证用户密码
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object|null>} 用户信息或null
   */
  async authenticateUser(username, password) {
    const user = await this.findUserByName(username);
    if (!user) {
      return null;
    }

    try {
      const isValid = await argon2.verify(user.hash, password);
      if (!isValid) {
        return null;
      }
      return user;
    } catch (err) {
      throw createError('密码验证失败: ' + err.message, 500, 'PASSWORD_VERIFY_ERROR');
    }
  }

  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建的用户信息
   */
  async createUser(userData) {
    const { name, password, isAdmin = false } = userData;

    // 检查用户是否已存在
    const existingUser = await this.findUserByName(name);
    if (existingUser) {
      throw createError('用户名已存在', 400, 'USER_EXISTS_ERROR');
    }

    // 验证密码强度
    if (password.length < this.minPasswordLength) {
      throw createError(`密码长度至少${this.minPasswordLength}个字符`, 400, 'PASSWORD_TOO_SHORT');
    }

    // 创建新用户
    const newUser = {
      name,
      hash: await argon2.hash(password),
      isAdmin,
      pass_set: true,
      createdAt: new Date().toISOString()
    };

    const users = await this.getUsers();
    users.push(newUser);
    
    await this.updateUsers(users);
    return { ...newUser, hash: undefined }; // 不返回密码哈希
  }

  /**
   * 更新用户信息
   * @param {string} name - 用户名
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的用户信息
   */
  async updateUser(name, updateData) {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.name === name);
    
    if (userIndex === -1) {
      throw createError('用户不存在', 404, 'USER_NOT_FOUND_ERROR');
    }

    const user = users[userIndex];
    const updatedUser = { ...user, ...updateData };

    // 如果更新密码
    if (updateData.password) {
      if (updateData.password.length < this.minPasswordLength) {
        throw createError(`密码长度至少${this.minPasswordLength}个字符`, 400, 'PASSWORD_TOO_SHORT');
      }
      updatedUser.hash = await argon2.hash(updateData.password);
      updatedUser.pass_set = true;
    }

    // 如果更新用户名，检查是否冲突
    if (updateData.name && updateData.name !== name) {
      const existingUser = await this.findUserByName(updateData.name);
      if (existingUser) {
        throw createError('用户名已存在', 400, 'USER_EXISTS_ERROR');
      }
      updatedUser.name = updateData.name;
    }

    users[userIndex] = updatedUser;
    await this.updateUsers(users);
    
    return { ...updatedUser, hash: undefined };
  }

  /**
   * 删除用户
   * @param {string} name - 用户名
   * @returns {Promise<boolean>} 是否成功删除
   */
  async deleteUser(name) {
    // 不能删除最后一个管理员
    if (name === 'admin') {
      const users = await this.getUsers();
      const adminCount = users.filter(user => user.isAdmin).length;
      if (adminCount <= 1) {
        throw createError('不能删除最后一个管理员用户', 400, 'CANNOT_DELETE_LAST_ADMIN');
      }
    }

    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.name !== name);
    
    if (filteredUsers.length === users.length) {
      throw createError('用户不存在', 404, 'USER_NOT_FOUND_ERROR');
    }

    await this.updateUsers(filteredUsers);
    return true;
  }

  /**
   * 修改密码
   * @param {string} name - 用户名
   * @param {string} currentPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<boolean>} 是否成功
   */
  async changePassword(name, currentPassword, newPassword) {
    const user = await this.findUserByName(name);
    if (!user) {
      throw createError('用户不存在', 404, 'USER_NOT_FOUND_ERROR');
    }

    // 验证当前密码
    const isValid = await argon2.verify(user.hash, currentPassword);
    if (!isValid) {
      throw createError('当前密码错误', 400, 'INVALID_CURRENT_PASSWORD');
    }

    // 验证新密码强度
    if (newPassword.length < this.minPasswordLength) {
      throw createError(`新密码长度至少${this.minPasswordLength}个字符`, 400, 'PASSWORD_TOO_SHORT');
    }

    // 更新密码
    const updatedUser = {
      ...user,
      hash: await argon2.hash(newPassword),
      pass_set: true
    };

    const users = await this.getUsers();
    const userIndex = users.findIndex(u => u.name === name);
    users[userIndex] = updatedUser;
    
    await this.updateUsers(users);
    return true;
  }

  /**
   * 设置初始密码（首次登录后）
   * @param {string} name - 用户名
   * @param {string} newPassword - 新密码
   * @returns {Promise<boolean>} 是否成功
   */
  async setInitialPassword(name, newPassword) {
    const user = await this.findUserByName(name);
    if (!user) {
      throw createError('用户不存在', 404, 'USER_NOT_FOUND_ERROR');
    }

    if (user.pass_set) {
      throw createError('密码已设置，请使用修改密码功能', 400, 'PASSWORD_ALREADY_SET');
    }

    // 验证新密码强度
    if (newPassword.length < this.minPasswordLength) {
      throw createError(`密码长度至少${this.minPasswordLength}个字符`, 400, 'PASSWORD_TOO_SHORT');
    }

    // 更新密码
    const updatedUser = {
      ...user,
      hash: await argon2.hash(newPassword),
      pass_set: true
    };

    const users = await this.getUsers();
    const userIndex = users.findIndex(u => u.name === name);
    users[userIndex] = updatedUser;
    
    await this.updateUsers(users);
    return true;
  }
}

module.exports = new UserService();