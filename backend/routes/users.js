/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const express = require('express');
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/users
 * @desc 获取用户列表
 * @access Private (Admin only)
 */
router.get('/', verifyToken, UserController.getUsers);

/**
 * @route GET /api/users/:id
 * @desc 获取用户详情
 * @access Private
 */
router.get('/:name', verifyToken, UserController.getUser);

/**
 * @route POST /api/users
 * @desc 创建用户
 * @access Private (Admin only)
 */
router.post('/', UserController.createUser);

/**
 * @route PUT /api/users/:id
 * @desc 更新用户信息
 * @access Private (Admin only)
 */
router.put('/:name', UserController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc 删除用户
 * @access Private (Admin only)
 */
router.delete('/:name', UserController.deleteUser);

/**
 * @route POST /api/users/:id/password
 * @desc 修改用户密码
 * @access Private
 */
router.post('/:name/password', UserController.changePassword);

module.exports = router;