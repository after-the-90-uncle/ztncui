/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const express = require('express');
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc 用户登录
 * @access Public
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @route POST /api/auth/logout
 * @desc 用户登出
 * @access Private
 */
router.post('/logout', verifyToken, AuthController.logout);

/**
 * @route GET /api/auth/profile
 * @desc 获取当前用户信息
 * @access Private
 */
router.get('/profile', verifyToken, AuthController.getProfile);

/**
 * @route POST /api/auth/refresh
 * @desc 刷新访问令牌
 * @access Private
 */
router.post('/refresh', verifyToken, AuthController.refresh);

/**
 * @route POST /api/auth/change-password
 * @desc 修改密码
 * @access Private
 */
router.post('/change-password', verifyToken, AuthController.changePassword);

/**
 * @route POST /api/auth/set-password
 * @desc 设置初始密码
 * @access Private
 */
router.post('/set-password', verifyToken, AuthController.setPassword);

module.exports = router;