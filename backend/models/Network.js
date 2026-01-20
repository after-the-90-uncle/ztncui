/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const zerotierService = require('../services/zerotierService');

/**
 * 网络模型
 */
class Network {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.nwid = data.nwid || data.id;
    this.private = data.private;
    this.description = data.description;
    this.ipAssignmentPools = data.ipAssignmentPools || [];
    this.routes = data.routes || [];
    this.dns = data.dns;
    this.v4AssignMode = data.v4AssignMode;
    this.v6AssignMode = data.v6AssignMode;
    this.creationTime = data.creationTime;
    this.memberRevision = data.memberRevision;
  }

  /**
   * 创建网络实例
   * @param {Object} data - 网络数据
   * @returns {Network} 网络实例
   */
  static fromData(data) {
    return new Network(data);
  }

  /**
   * 获取网络列表
   * @returns {Promise<Array<Network>>} 网络列表
   */
  static async getAll() {
    const networks = await zerotierService.getNetworks();
    return networks.map(network => Network.fromData(network));
  }

  /**
   * 根据ID获取网络详情
   * @param {string} nwid - 网络ID
   * @returns {Promise<Network>} 网络实例
   */
  static async findById(nwid) {
    const network = await zerotierService.getNetwork(nwid);
    return Network.fromData(network);
  }

  /**
   * 创建网络
   * @param {string} name - 网络名称
   * @returns {Promise<Network>} 新网络实例
   */
  static async create(name) {
    const network = await zerotierService.createNetwork(name);
    return Network.fromData(network);
  }

  /**
   * 删除网络
   * @param {string} nwid - 网络ID
   * @returns {Promise<boolean>} 是否成功
   */
  static async delete(nwid) {
    return await zerotierService.deleteNetwork(nwid);
  }

  /**
   * 更新网络配置
   * @param {string} nwid - 网络ID
   * @param {Object} config - 配置对象
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updateConfig(nwid, config) {
    const network = await zerotierService.updateNetworkConfig(nwid, config);
    return Network.fromData(network);
  }

  /**
   * 获取网络成员列表
   * @param {string} nwid - 网络ID
   * @returns {Promise<Object>} 成员对象
   */
  static async getMembers(nwid) {
    return await zerotierService.getMembers(nwid);
  }

  /**
   * 获取成员详情
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @returns {Promise<Object>} 成员信息
   */
  static async getMember(nwid, id) {
    return await zerotierService.getMember(nwid, id);
  }

  /**
   * 更新成员配置
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @param {Object} config - 配置对象
   * @returns {Promise<Object>} 更新结果
   */
  static async updateMember(nwid, id, config) {
    return await zerotierService.updateMemberConfig(nwid, id, config);
  }

  /**
   * 删除成员
   * @param {string} nwid - 网络ID
   * @param {string} id - 成员ID
   * @returns {Promise<Object>} 删除结果
   */
  static async deleteMember(nwid, id) {
    return await zerotierService.deleteMember(nwid, id);
  }

  /**
   * 获取对等节点列表
   * @returns {Promise<Array>} 对等节点列表
   */
  static async getPeers() {
    return await zerotierService.getPeers();
  }

  /**
   * 获取对等节点信息
   * @param {string} id - 对等节点ID
   * @returns {Promise<Object|null>} 对等节点信息
   */
  static async getPeer(id) {
    return await zerotierService.getPeer(id);
  }

  /**
   * 更新网络名称
   * @param {string} nwid - 网络ID
   * @param {string} name - 网络名称
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updateName(nwid, name) {
    return await Network.updateConfig(nwid, { name });
  }

  /**
   * 更新私有网络设置
   * @param {string} nwid - 网络ID
   * @param {boolean} isPrivate - 是否为私有网络
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updatePrivate(nwid, isPrivate) {
    return await Network.updateConfig(nwid, { private: isPrivate });
  }

  /**
   * 更新IPv4分配模式
   * @param {string} nwid - 网络ID
   * @param {string} mode - 分配模式
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updateV4AssignMode(nwid, mode) {
    return await Network.updateConfig(nwid, { v4AssignMode: mode });
  }

  /**
   * 更新IPv6分配模式
   * @param {string} nwid - 网络ID
   * @param {string} mode - 分配模式
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updateV6AssignMode(nwid, mode) {
    return await Network.updateConfig(nwid, { v6AssignMode: mode });
  }

  /**
   * 管理IP分配池
   * @param {string} nwid - 网络ID
   * @param {Object} pool - IP池配置
   * @param {string} action - 操作类型 (add/delete)
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async manageIPAssignmentPool(nwid, pool, action) {
    const network = await Network.findById(nwid);
    const pools = [...network.ipAssignmentPools];

    if (action === 'add') {
      pools.push(pool);
    } else if (action === 'delete') {
      const index = pools.findIndex(p => 
        p.ipRangeStart === pool.ipRangeStart && p.ipRangeEnd === pool.ipRangeEnd
      );
      if (index !== -1) {
        pools.splice(index, 1);
      }
    }

    return await Network.updateConfig(nwid, { ipAssignmentPools: pools });
  }

  /**
   * 管理路由
   * @param {string} nwid - 网络ID
   * @param {Object} route - 路由配置
   * @param {string} action - 操作类型 (add/delete)
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async manageRoute(nwid, route, action) {
    const network = await Network.findById(nwid);
    const routes = [...network.routes];

    if (action === 'add') {
      routes.push(route);
    } else if (action === 'delete') {
      const index = routes.findIndex(r => r.target === route.target);
      if (index !== -1) {
        routes.splice(index, 1);
      }
    }

    return await Network.updateConfig(nwid, { routes });
  }

  /**
   * 更新DNS配置
   * @param {string} nwid - 网络ID
   * @param {Object} dns - DNS配置
   * @returns {Promise<Network>} 更新后的网络实例
   */
  static async updateDNS(nwid, dns) {
    return await Network.updateConfig(nwid, { dns });
  }

  /**
   * 转换为JSON对象
   * @returns {Object} 网络对象
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nwid: this.nwid,
      private: this.private,
      description: this.description,
      ipAssignmentPools: this.ipAssignmentPools,
      routes: this.routes,
      dns: this.dns,
      v4AssignMode: this.v4AssignMode,
      v6AssignMode: this.v6AssignMode,
      creationTime: this.creationTime,
      memberRevision: this.memberRevision
    };
  }
}

module.exports = Network;