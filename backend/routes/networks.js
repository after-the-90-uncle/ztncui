/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const express = require('express');
const NetworkController = require('../controllers/networkController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/networks
 * @desc 获取网络列表
 * @access Private
 */
router.get('/', verifyToken, NetworkController.getNetworks);

/**
 * @route POST /api/networks
 * @desc 创建网络
 * @access Private
 */
router.post('/', NetworkController.createNetwork);

/**
 * @route GET /api/networks/:id
 * @desc 获取网络详情
 * @access Private
 */
router.get('/:nwid', NetworkController.getNetwork);

/**
 * @route PUT /api/networks/:id
 * @desc 更新网络配置
 * @access Private
 */
router.put('/:nwid', NetworkController.updateNetwork);

/**
 * @route DELETE /api/networks/:id
 * @desc 删除网络
 * @access Private
 */
router.delete('/:nwid', NetworkController.deleteNetwork);

/**
 * @route GET /api/networks/:nid/members
 * @desc 获取网络成员列表
 * @access Private
 */
router.get('/:nwid/members', NetworkController.getMembers);

/**
 * @route GET /api/networks/:nid/members/:id
 * @desc 获取成员详情
 * @access Private
 */
router.get('/:nwid/members/:id', NetworkController.getMember);

/**
 * @route PUT /api/networks/:nid/members/:id
 * @desc 更新成员配置
 * @access Private
 */
router.put('/:nwid/members/:id', NetworkController.updateMember);

/**
 * @route DELETE /api/networks/:nid/members/:id
 * @desc 删除成员
 * @access Private
 */
router.delete('/:nwid/members/:id', NetworkController.deleteMember);

/**
 * @route POST /api/networks/:nid/members/:id/name
 * @desc 设置成员名称
 * @access Private
 */
router.post('/:nwid/members/:id/name', NetworkController.setMemberName);

/**
 * @route POST /api/networks/:nid/pools
 * @desc 管理IP分配池
 * @access Private
 */
router.post('/:nwid/pools', NetworkController.manageIPPool);

/**
 * @route POST /api/networks/:nid/routes
 * @desc 管理路由
 * @access Private
 */
router.post('/:nwid/routes', NetworkController.manageRoute);

/**
 * @route PUT /api/networks/:nid/dns
 * @desc 更新DNS配置
 * @access Private
 */
router.put('/:nwid/dns', NetworkController.updateDNS);

/**
 * @route GET /api/networks/:nid/status
 * @desc 获取网络状态
 * @access Private
 */
router.get('/:nwid/status', NetworkController.getStatus);

module.exports = router;