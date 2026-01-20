/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const Network = require('../models/Network');
const User = require('../models/User');
const storage = require('node-persist');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateNetworkCreation,
  validateNetworkUpdate,
  validateIPAssignmentPool,
  validateRoute,
  validateDNS,
  validateMemberAuthorization,
  validateIPAssignment,
  validateMemberName,
  validateNetworkId,
  validateMemberId
} = require('../middleware/validation');

/**
 * 网络管理控制器
 */
class NetworkController {
  /**
   * 获取网络列表
   * @route GET /api/networks
   */
  static getNetworks = asyncHandler(async (req, res) => {
    const networks = await Network.getAll();

    res.json({
      success: true,
      data: {
        networks: networks.map(network => network.toJSON())
      }
    });
  });

  /**
   * 创建网络
   * @route POST /api/networks
   */
  static createNetwork = [
    validateNetworkCreation,
    asyncHandler(async (req, res) => {
      const { name } = req.body;

      const network = await Network.create(name);

      res.status(201).json({
        success: true,
        data: {
          network: network.toJSON()
        },
        message: '网络创建成功'
      });
    })
  ];

  /**
   * 获取网络详情
   * @route GET /api/networks/:id
   */
  static getNetwork = [
    validateNetworkId,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;

      const network = await Network.findById(nwid);

      res.json({
        success: true,
        data: {
          network: network.toJSON()
        }
      });
    })
  ];

  /**
   * 更新网络配置
   * @route PUT /api/networks/:id
   */
  static updateNetwork = [
    validateNetworkId,
    validateNetworkUpdate,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;
      const config = req.body;

      const network = await Network.updateConfig(nwid, config);

      res.json({
        success: true,
        data: {
          network: network.toJSON()
        },
        message: '网络配置更新成功'
      });
    })
  ];

  /**
   * 删除网络
   * @route DELETE /api/networks/:id
   */
  static deleteNetwork = [
    validateNetworkId,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;

      await Network.delete(nwid);

      res.json({
        success: true,
        message: '网络删除成功'
      });
    })
  ];

  /**
   * 获取网络成员列表
   * @route GET /api/networks/:nid/members
   */
  static getMembers = [
    validateNetworkId,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;

      // 获取成员列表并添加存储的成员名称
      const memberIds = await Network.getMembers(nwid);
      const membersWithNames = {};

      for (const [memberId, memberData] of Object.entries(memberIds)) {
        const name = await storage.getItem(memberId);
        membersWithNames[memberId] = {
          ...memberData,
          name: name || ''
        };
      }

      // 获取对等节点信息
      const peers = await Network.getPeers();

      // 为每个成员添加对等节点信息
      for (const memberId in membersWithNames) {
        const member = membersWithNames[memberId];
        member.peer = peers.find(peer => peer.address === member.address);
      }

      res.json({
        success: true,
        data: {
          members: membersWithNames
        }
      });
    })
  ];

  /**
   * 获取成员详情
   * @route GET /api/networks/:nid/members/:id
   */
  static getMember = [
    validateNetworkId,
    validateMemberId,
    asyncHandler(async (req, res) => {
      const { nwid, id } = req.params;

      const [memberData, peerInfo, memberName] = await Promise.all([
        Network.getMember(nwid, id),
        Network.getPeer(id),
        storage.getItem(id)
      ]);

      const member = {
        ...memberData,
        name: memberName || '',
        peer: peerInfo
      };

      res.json({
        success: true,
        data: {
          member
        }
      });
    })
  ];

  /**
   * 更新成员配置
   * @route PUT /api/networks/:nid/members/:id
   */
  static updateMember = [
    validateNetworkId,
    validateMemberId,
    asyncHandler(async (req, res) => {
      const { nwid, id } = req.params;
      const config = req.body;

      const result = await Network.updateMember(nwid, id, config);

      res.json({
        success: true,
        data: {
          member: result
        },
        message: '成员配置更新成功'
      });
    })
  ];

  /**
   * 删除成员
   * @route DELETE /api/networks/:nid/members/:id
   */
  static deleteMember = [
    validateNetworkId,
    validateMemberId,
    asyncHandler(async (req, res) => {
      const { nwid, id } = req.params;

      const result = await Network.deleteMember(nwid, id);

      res.json({
        success: true,
        data: result,
        message: '成员删除成功'
      });
    })
  ];

  /**
   * 设置成员名称
   * @route POST /api/networks/:nid/members/:id/name
   */
  static setMemberName = [
    validateNetworkId,
    validateMemberId,
    validateMemberName,
    asyncHandler(async (req, res) => {
      const { nwid, id } = req.params;
      const { name } = req.body;

      await storage.setItem(id, name);

      res.json({
        success: true,
        message: '成员名称设置成功'
      });
    })
  ];

  /**
   * 管理IP分配池
   * @route POST /api/networks/:nid/pools
   */
  static manageIPPool = [
    validateNetworkId,
    validateIPAssignmentPool,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;
      const { ipRangeStart, ipRangeEnd } = req.body;
      const { action } = req.query;

      const pool = { ipRangeStart, ipRangeEnd };
      const network = await Network.manageIPAssignmentPool(nwid, pool, action);

      res.json({
        success: true,
        data: {
          network: network.toJSON()
        },
        message: `IP分配池${action === 'add' ? '添加' : '删除'}成功`
      });
    })
  ];

  /**
   * 管理路由
   * @route POST /api/networks/:nid/routes
   */
  static manageRoute = [
    validateNetworkId,
    validateRoute,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;
      const routeData = req.body;
      const { action } = req.query;

      const network = await Network.manageRoute(nwid, routeData, action);

      res.json({
        success: true,
        data: {
          network: network.toJSON()
        },
        message: `路由${action === 'add' ? '添加' : '删除'}成功`
      });
    })
  ];

  /**
   * 更新DNS配置
   * @route PUT /api/networks/:nid/dns
   */
  static updateDNS = [
    validateNetworkId,
    validateDNS,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;
      const dns = req.body;

      const network = await Network.updateDNS(nwid, dns);

      res.json({
        success: true,
        data: {
          network: network.toJSON()
        },
        message: 'DNS配置更新成功'
      });
    })
  ];

  /**
   * 获取网络状态
   * @route GET /api/networks/:nid/status
   */
  static getStatus = [
    validateNetworkId,
    asyncHandler(async (req, res) => {
      const { nwid } = req.params;

      const [network, peers] = await Promise.all([
        Network.findById(nwid),
        Network.getPeers()
      ]);

      res.json({
        success: true,
        data: {
          network: network.toJSON(),
          peers
        }
      });
    })
  ];
}

module.exports = NetworkController;