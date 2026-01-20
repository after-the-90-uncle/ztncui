/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAdmin } = require('../middleware/auth');
const {
  validateUserCreation,
  validateUserUpdate,
  validatePasswordChange,
  validateObjectId
} = require('../middleware/validation');

/**
 * 用户管理控制器
 */
class UserController {
  /**
   * 获取用户列表
   * @route GET /api/users
   */
  static getUsers = asyncHandler(async (req, res) => {
    const users = await User.getAll();

    res.json({
      success: true,
      data: {
        users: users.map(user => user.toJSON())
      }
    });
  });

  /**
   * 获取用户详情
   * @route GET /api/users/:id
   */
  static getUser = asyncHandler(async (req, res) => {
    const { name } = req.params;

    const user = await User.findByName(name);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '用户不存在'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  });

  /**
   * 创建用户
   * @route POST /api/users
   */
  static createUser = [
    requireAdmin,
    validateUserCreation,
    asyncHandler(async (req, res) => {
      const { name, password, isAdmin = false } = req.body;

      const user = await User.create({
        name,
        password,
        isAdmin
      });

      res.status(201).json({
        success: true,
        data: {
          user: user.toJSON()
        },
        message: '用户创建成功'
      });
    })
  ];

  /**
   * 更新用户信息
   * @route PUT /api/users/:id
   */
  static updateUser = [
    requireAdmin,
    validateObjectId,
    validateUserUpdate,
    asyncHandler(async (req, res) => {
      const { name } = req.params;
      const updateData = req.body;

      // 防止通过PUT更新密码
      if (updateData.password) {
        delete updateData.password;
      }

      const user = await User.update(name, updateData);

      res.json({
        success: true,
        data: {
          user: user.toJSON()
        },
        message: '用户信息更新成功'
      });
    })
  ];

  /**
   * 删除用户
   * @route DELETE /api/users/:id
   */
  static deleteUser = [
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { name } = req.params;

      await User.delete(name);

      res.json({
        success: true,
        message: '用户删除成功'
      });
    })
  ];

  /**
   * 修改用户密码
   * @route POST /api/users/:id/password
   */
  static changePassword = [
    validateObjectId,
    validatePasswordChange,
    asyncHandler(async (req, res) => {
      const { name } = req.params;
      const { currentPassword, newPassword } = req.body;

      // 用户只能修改自己的密码，管理员可以修改任何人的密码
      if (name !== req.user.name && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '只能修改自己的密码'
          }
        });
      }

      await User.changePassword(name, currentPassword, newPassword);

      res.json({
        success: true,
        message: '密码修改成功'
      });
    })
  ];
}

module.exports = UserController;