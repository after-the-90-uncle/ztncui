/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT Token服务
 */
class JWTService {
  /**
   * 生成访问令牌
   * @param {Object} payload - 用户信息
   * @returns {string} JWT Token
   */
  generateAccessToken(payload) {
    return jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        isAdmin: payload.isAdmin || false
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * 生成刷新令牌
   * @param {Object} payload - 用户信息
   * @returns {string} JWT Refresh Token
   */
  generateRefreshToken(payload) {
    return jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        type: 'refresh'
      },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  /**
   * 验证令牌
   * @param {string} token - JWT Token
   * @returns {Object} 解码后的payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token验证失败: ' + error.message);
    }
  }

  /**
   * 解码令牌（不验证）
   * @param {string} token - JWT Token
   * @returns {Object} 解码后的payload
   */
  decodeToken(token) {
    return jwt.decode(token);
  }

  /**
   * 检查令牌是否即将过期
   * @param {string} token - JWT Token
   * @param {number} threshold - 过期阈值（毫秒）
   * @returns {boolean} 是否即将过期
   */
  isTokenExpiringSoon(token, threshold = 3600000) { // 1 hour default
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      
      return timeUntilExpiry <= (threshold / 1000);
    } catch (error) {
      return false;
    }
  }
}

module.exports = new JWTService();