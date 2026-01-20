/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const User = require('../models/User');
const jwtService = require('../services/jwtService');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateLogin } = require('../middleware/validation');

/**
 * 认证控制器
 */
class AuthController {
  /**
   * 用户登录
   * @route POST /api/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.authenticate(username, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '用户名或密码错误'
        }
      });
    }

    const token = jwtService.generateAccessToken(user.toJSON());
    const refreshToken = jwtService.generateRefreshToken(user.toJSON());

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      },
      message: '登录成功'
    });
  });

  /**
   * 用户登出
   * @route POST /api/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: '登出成功'
    });
  });

  /**
   * 获取当前用户信息
   * @route GET /api/auth/profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    const user = await User.findByName(req.user.name);
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
   * 刷新令牌
   * @route POST /api/auth/refresh
   */
  static refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: '缺少刷新令牌'
        }
      });
    }

    try {
      const decoded = jwtService.verifyToken(refreshToken);
      if (decoded.type !== 'refresh') {
        throw new Error('无效的刷新令牌类型');
      }

      const user = await User.findByName(decoded.name);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '用户不存在'
          }
        });
      }

      const newToken = jwtService.generateAccessToken(user.toJSON());
      const newRefreshToken = jwtService.generateRefreshToken(user.toJSON());

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        },
        message: '令牌刷新成功'
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: '刷新令牌无效或已过期'
        }
      });
    }
  });

  /**
   * 修改密码
   * @route POST /api/auth/change-password
   */
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userName = req.user.name;

    await User.changePassword(userName, currentPassword, newPassword);

    res.json({
      success: true,
      message: '密码修改成功'
    });
  });

  /**
   * 设置初始密码（首次登录后）
   * @route POST /api/auth/set-password
   */
  static setPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userName = req.user.name;

    await User.setInitialPassword(userName, password);

    res.json({
      success: true,
      message: '初始密码设置成功'
    });
  });
}

module.exports = AuthController;