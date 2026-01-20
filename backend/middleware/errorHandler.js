/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const config = require('../config');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // 默认错误信息
  let status = 500;
  let message = '服务器内部错误';
  let code = 'INTERNAL_ERROR';

  // 根据错误类型设置状态码和消息
  if (err.name === 'ValidationError') {
    status = 400;
    message = '请求参数验证失败';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = '未授权访问';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    status = 403;
    message = '权限不足';
    code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    status = 404;
    message = '资源不存在';
    code = 'NOT_FOUND';
  } else if (err.status) {
    status = err.status;
    message = err.message || message;
  }

  // 错误响应格式
  const errorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(config.nodeEnv === 'development' && { details: err.message })
    }
  };

  // 添加堆栈信息（仅开发环境）
  if (config.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};

/**
 * 404错误处理
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `接口 ${req.method} ${req.path} 不存在`
    }
  });
};

/**
 * 异步错误捕获包装器
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 创建自定义错误
 */
const createError = (message, status = 500, code = 'CUSTOM_ERROR') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createError
};
