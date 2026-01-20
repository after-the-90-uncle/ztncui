/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const { body, param, query, validationResult } = require('express-validator');

/**
 * 验证结果处理中间件
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '请求参数验证失败',
        details: errors.array()
      }
    });
  }
  next();
};

/**
 * 用户相关验证规则
 */
const validateUserCreation = [
  body('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('用户名只能包含字母、数字、下划线和连字符'),
  
  body('password')
    .isLength({ min: 10 })
    .withMessage('密码长度至少10个字符'),
  
  handleValidationErrors
];

const validatePasswordChange = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('当前密码不能为空'),
  
  body('newPassword')
    .isLength({ min: 10 })
    .withMessage('新密码长度至少10个字符'),
  
  handleValidationErrors
];

const validateLogin = [
  body('username')
    .isLength({ min: 1 })
    .withMessage('用户名不能为空'),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('密码不能为空'),
  
  handleValidationErrors
];

const validateNetworkCreation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('网络名称长度必须在1-100个字符之间'),
  
  handleValidationErrors
];

const validateNetworkId = [
  param('nwid')
    .matches(/^[0-9a-fA-F]{16}$/)
    .withMessage('网络ID必须是16位十六进制字符'),
  
  handleValidationErrors
];

const validateMemberId = [
  param('id')
    .isLength({ min: 10, max: 11 })
    .withMessage('成员ID必须是10-11位字符'),
  
  handleValidationErrors
];

const validateNetworkUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('网络名称长度必须在1-100个字符之间'),
  
  handleValidationErrors
];

const validateMemberAuthorization = [
  body('authorized')
    .isBoolean()
    .withMessage('授权状态必须是布尔值'),
  
  handleValidationErrors
];

const validateIPAssignment = [
  body('ipAssignments')
    .isArray()
    .withMessage('IP地址分配必须是数组'),
  
  handleValidationErrors
];

const validateMemberName = [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('成员名称长度必须在1-50个字符之间'),

  handleValidationErrors
];

const validateUserUpdate = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('用户名只能包含字母、数字、下划线和连字符'),

  body('isAdmin')
    .optional()
    .isBoolean()
    .withMessage('管理员标识必须是布尔值'),

  handleValidationErrors
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('无效的对象ID'),

  handleValidationErrors
];

const validateIPAssignmentPool = [
  body('ipRangeStart')
    .matches(/^(\d{1,3}\.){3}\d{1,3}$/)
    .withMessage('起始IP地址格式不正确'),
  
  body('ipRangeEnd')
    .matches(/^(\d{1,3}\.){3}\d{1,3}$/)
    .withMessage('结束IP地址格式不正确'),
  
  handleValidationErrors
];

const validateRoute = [
  body('target')
    .matches(/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/)
    .withMessage('路由目标格式不正确'),
  
  body('via')
    .matches(/^(\d{1,3}\.){3}\d{1,3}$/)
    .withMessage('下一跳IP地址格式不正确'),
  
  handleValidationErrors
];

const validateDNS = [
  body('servers')
    .isArray()
    .withMessage('DNS服务器必须是数组'),
  
  body('servers.*')
    .matches(/^(\d{1,3}\.){3}\d{1,3}$/)
    .withMessage('DNS服务器地址格式不正确'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserCreation,
  validateUserUpdate,
  validateObjectId,
  validatePasswordChange,
  validateLogin,
  validateNetworkCreation,
  validateNetworkId,
  validateMemberId,
  validateNetworkUpdate,
  validateMemberAuthorization,
  validateIPAssignment,
  validateMemberName,
  validateIPAssignmentPool,
  validateRoute,
  validateDNS
};