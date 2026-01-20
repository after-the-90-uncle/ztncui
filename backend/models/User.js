/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const userService = require('../services/userService');

/**
 * 用户模型
 */
class User {
  constructor(data) {
    this.id = data.name;
    this.name = data.name;
    this.isAdmin = data.isAdmin || false;
    this.passSet = data.pass_set || false;
    this.createdAt = data.createdAt;
  }

  /**
   * 创建用户实例
   * @param {Object} data - 用户数据
   * @returns {User} 用户实例
   */
  static fromData(data) {
    return new User(data);
  }

  /**
   * 获取用户列表
   * @returns {Promise<Array<User>>} 用户列表
   */
  static async getAll() {
    const users = await userService.getUsers();
    return users.map(user => User.fromData(user));
  }

  /**
   * 根据用户名获取用户
   * @param {string} name - 用户名
   * @returns {Promise<User|null>} 用户实例
   */
  static async findByName(name) {
    const user = await userService.findUserByName(name);
    return user ? User.fromData(user) : null;
  }

  /**
   * 验证用户密码
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<User|null>} 用户实例或null
   */
  static async authenticate(username, password) {
    const user = await userService.authenticateUser(username, password);
    return user ? User.fromData(user) : null;
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<User>} 新用户实例
   */
  static async create(userInfo) {
    const createdUserData = await userService.createUser(userInfo);
    return User.fromData(createdUserData);
  }

  /**
   * 更新用户信息
   * @param {string} name - 用户名
   * @param {Object} updateData - 更新数据
   * @returns {Promise<User>} 更新后的用户实例
   */
  static async update(name, updateData) {
    const userData = await userService.updateUser(name, updateData);
    return User.fromData(userData);
  }

  /**
   * 删除用户
   * @param {string} name - 用户名
   * @returns {Promise<boolean>} 是否成功
   */
  static async delete(name) {
    return await userService.deleteUser(name);
  }

  /**
   * 修改密码
   * @param {string} name - 用户名
   * @param {string} currentPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<boolean>} 是否成功
   */
  static async changePassword(name, currentPassword, newPassword) {
    return await userService.changePassword(name, currentPassword, newPassword);
  }

  /**
   * 设置初始密码
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {Promise<boolean>} 是否成功
   */
  static async setInitialPassword(name, password) {
    return await userService.setInitialPassword(name, password);
  }

  /**
   * 转换为JSON对象（不包含敏感信息）
   * @returns {Object} 安全的用户对象
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isAdmin: this.isAdmin,
      passSet: this.passSet,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;