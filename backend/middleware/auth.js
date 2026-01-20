/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT Token验证中间件
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失'
    });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌格式错误'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '访问令牌无效或已过期'
    });
  }
};

/**
 * Session验证中间件（向后兼容）
 */
const verifySession = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = {
      id: req.session.user.id,
      name: req.session.user.name,
      isAdmin: req.session.user.isAdmin
    };
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: '未登录或会话已过期'
    });
  }
};

/**
 * 权限检查中间件
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '需要认证'
    });
  }
  next();
};

/**
 * 管理员权限检查
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
  }
  next();
};

/**
 * 可选认证中间件（登录用户和未登录用户都可以访问）
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
    } catch (error) {
      // Token无效时忽略，继续处理请求
    }
  }
  
  next();
};

module.exports = {
  verifyToken,
  verifySession,
  requireAuth,
  requireAdmin,
  optionalAuth
};
