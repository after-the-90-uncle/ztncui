/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const got = require('got');
const ipaddr = require('ip-address');
const config = require('../config');
const { createError } = require('../middleware/errorHandler');

/**
 * ZeroTier API服务
 */
class ZeroTierService {
  constructor() {
    this.ztAddr = config.zerotier.addr;
  }

  /**
   * 初始化ZeroTier API选项
   * @returns {Object} 请求配置
   */
  async initOptions() {
    let token;
    try {
      token = await this.getToken();
    } catch (err) {
      throw createError('ZeroTier认证失败: ' + err.message, 401, 'ZT_AUTH_ERROR');
    }

    return {
      json: true,
      headers: {
        'X-ZT1-Auth': token
      }
    };
  }

  /**
   * 获取ZeroTier认证令牌
   * @returns {string} 认证令牌
   */
  async getToken() {
    // 优先使用环境变量中的token
    if (config.zerotier.token) {
      return config.zerotier.token;
    }

    // 尝试读取authtoken.secret文件
    const fs = require('fs');
    const path = require('path');
    
    const possiblePaths = [
      '/var/lib/zerotier-one/authtoken.secret',
      path.join(__dirname, '../../authtoken.secret'),
      path.join(process.cwd(), 'authtoken.secret')
    ];

    for (const tokenPath of possiblePaths) {
      try {
        if (fs.existsSync(tokenPath)) {
          const token = fs.readFileSync(tokenPath, 'utf8').trim();
          if (token) {
            return token;
          }
        }
      } catch (err) {
        console.warn('读取Token文件失败:', tokenPath, err.message);
      }
    }

    throw createError('无法获取ZeroTier认证令牌', 401, 'ZT_TOKEN_NOT_FOUND');
  }

  /**
   * 获取ZeroTier状态
   * @returns {Object} 状态信息
   */
  async getStatus() {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/status`, options);
      return response.body;
    } catch (err) {
      throw createError('获取ZeroTier状态失败: ' + err.message, 500, 'ZT_STATUS_ERROR');
    }
  }

  /**
   * 获取控制器地址
   * @returns {string} 控制器地址
   */
  async getAddress() {
    const status = await this.getStatus();
    return status.address;
  }

  /**
   * 获取网络列表
   * @returns {Array} 网络列表
   */
  async getNetworks() {
    const options = await this.initOptions();
    
    let networkIds = [];
    try {
      const response = await got(`${this.ztAddr}/controller/network`, options);
      networkIds = response.body;
    } catch (err) {
      throw createError('获取网络列表失败: ' + err.message, 500, 'ZT_NETWORK_LIST_ERROR');
    }

    const networks = [];
    for (const nwid of networkIds) {
      try {
        const response = await got(`${this.ztAddr}/controller/network/${nwid}`, options);
        const network = response.body;
        // 只返回需要的字段
        networks.push({
          name: network.name || '',
          nwid: network.id || nwid
        });
      } catch (err) {
        console.warn(`获取网络详情失败: ${nwid}`, err.message);
      }
    }
    
    return networks;
  }

  /**
   * 获取网络详情
   * @param {string} nwid - 网络ID
   * @returns {Object} 网络详细信息
   */
  async getNetwork(nwid) {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}`, options);
      return response.body;
    } catch (err) {
      throw createError(`获取网络详情失败 (${nwid}): ` + err.message, 500, 'ZT_NETWORK_DETAIL_ERROR');
    }
  }

  /**
   * 创建网络
   * @param {string} name - 网络名称
   * @returns {Object} 创建结果
   */
  async createNetwork(name) {
    const options = await this.initOptions();
    options.method = 'POST';
    options.body = name;

    const ztAddress = await this.getAddress();
    
    try {
      const response = await got(
        `${this.ztAddr}/controller/network/${ztAddress}______`,
        options
      );
      return response.body;
    } catch (err) {
      throw createError('创建网络失败: ' + err.message, 500, 'ZT_CREATE_NETWORK_ERROR');
    }
  }

  /**
   * 删除网络
   * @param {string} nwid - 网络ID
   * @returns {Object} 删除结果
   */
  async deleteNetwork(nwid) {
    const options = await this.initOptions();
    options.method = 'DELETE';
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}`, options);
      return { ...response.body, deleted: true };
    } catch (err) {
      throw createError(`删除网络失败 (${nwid}): ` + err.message, 500, 'ZT_DELETE_NETWORK_ERROR');
    }
  }

  /**
   * 获取网络成员列表
   * @param {string} nwid - 网络ID
   * @returns {Object} 成员对象
   */
  async getMembers(nwid) {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}/member`, options);
      return response.body;
    } catch (err) {
      throw createError(`获取网络成员失败 (${nwid}): ` + err.message, 500, 'ZT_MEMBER_LIST_ERROR');
    }
  }

  /**
   * 获取成员详情
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @returns {Object} 成员详细信息
   */
  async getMember(nwid, id) {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}/member/${id}`, options);
      return response.body;
    } catch (err) {
      throw createError(`获取成员详情失败 (${nwid}/${id}): ` + err.message, 500, 'ZT_MEMBER_DETAIL_ERROR');
    }
  }

  /**
   * 更新网络配置
   * @param {string} nwid - 网络ID
   * @param {Object} config - 配置对象
   * @returns {Object} 更新结果
   */
  async updateNetworkConfig(nwid, config) {
    const options = await this.initOptions();
    options.method = 'POST';
    options.body = config;
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}`, options);
      return response.body;
    } catch (err) {
      throw createError(`更新网络配置失败 (${nwid}): ` + err.message, 500, 'ZT_UPDATE_NETWORK_ERROR');
    }
  }

  /**
   * 更新成员配置
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @param {Object} config - 配置对象
   * @returns {Object} 更新结果
   */
  async updateMemberConfig(nwid, id, config) {
    const options = await this.initOptions();
    options.method = 'POST';
    options.body = config;
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}/member/${id}`, options);
      return response.body;
    } catch (err) {
      throw createError(`更新成员配置失败 (${nwid}/${id}): ` + err.message, 500, 'ZT_UPDATE_MEMBER_ERROR');
    }
  }

  /**
   * 删除成员
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @returns {Object} 删除结果
   */
  async deleteMember(nwid, id) {
    const options = await this.initOptions();
    options.method = 'DELETE';
    
    try {
      const response = await got(`${this.ztAddr}/controller/network/${nwid}/member/${id}`, options);
      return { ...response.body, deleted: true };
    } catch (err) {
      throw createError(`删除成员失败 (${nwid}/${id}): ` + err.message, 500, 'ZT_DELETE_MEMBER_ERROR');
    }
  }

  /**
   * 获取对等节点列表
   * @returns {Array} 对等节点列表
   */
  async getPeers() {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/peer`, options);
      return response.body;
    } catch (err) {
      throw createError('获取对等节点列表失败: ' + err.message, 500, 'ZT_PEERS_ERROR');
    }
  }

  /**
   * 获取单个对等节点信息
   * @param {string} id - 对等节点ID
   * @returns {Object|null} 对等节点信息或null
   */
  async getPeer(id) {
    const options = await this.initOptions();
    
    try {
      const response = await got(`${this.ztAddr}/peer/${id}`, options);
      return response.body;
    } catch (err) {
      if (err.statusCode === 404) {
        return null;
      }
      throw createError(`获取对等节点信息失败 (${id}): ` + err.message, 500, 'ZT_PEER_ERROR');
    }
  }
}

module.exports = new ZeroTierService();