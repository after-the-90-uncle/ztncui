import { api } from './api';
import type {
  Network,
  NetworkMember,
  NetworkCreateRequest,
  NetworkUpdateRequest,
  IPAssignmentPoolRequest,
  RouteRequest,
  DNSRequest,
  MemberUpdateRequest,
  IPAssignmentRequest,
  ApiResponse
} from '@/types/api';

export const networkService = {
  /**
   * 获取网络列表
   */
  async getNetworks(): Promise<ApiResponse<{ networks: Network[] }>> {
    return api.get('/networks');
  },

  /**
   * 创建网络
   */
  async createNetwork(data: NetworkCreateRequest): Promise<ApiResponse<{ network: Network }>> {
    return api.post('/networks', data);
  },

  /**
   * 获取网络详情
   */
  async getNetwork(nwid: string): Promise<ApiResponse<{ network: Network }>> {
    return api.get(`/networks/${nwid}`);
  },

  /**
   * 更新网络配置
   */
  async updateNetwork(nwid: string, data: NetworkUpdateRequest): Promise<ApiResponse<{ network: Network }>> {
    return api.put(`/networks/${nwid}`, data);
  },

  /**
   * 删除网络
   */
  async deleteNetwork(nwid: string): Promise<ApiResponse> {
    return api.delete(`/networks/${nwid}`);
  },

  /**
   * 获取网络成员列表
   */
  async getMembers(nwid: string): Promise<ApiResponse<{ members: Record<string, NetworkMember> }>> {
    return api.get(`/networks/${nwid}/members`);
  },

  /**
   * 获取成员详情
   */
  async getMember(nwid: string, id: string): Promise<ApiResponse<{ member: NetworkMember }>> {
    return api.get(`/networks/${nwid}/members/${id}`);
  },

  /**
   * 更新成员配置
   */
  async updateMember(nwid: string, id: string, data: MemberUpdateRequest): Promise<ApiResponse<{ member: any }>> {
    return api.put(`/networks/${nwid}/members/${id}`, data);
  },

  /**
   * 删除成员
   */
  async deleteMember(nwid: string, id: string): Promise<ApiResponse> {
    return api.delete(`/networks/${nwid}/members/${id}`);
  },

  /**
   * 设置成员名称
   */
  async setMemberName(nwid: string, id: string, name: string): Promise<ApiResponse> {
    return api.post(`/networks/${nwid}/members/${id}/name`, { name });
  },

  /**
   * 管理IP分配池
   */
  async manageIPPool(nwid: string, pool: IPAssignmentPoolRequest, action: 'add' | 'delete'): Promise<ApiResponse<{ network: Network }>> {
    return api.post(`/networks/${nwid}/pools?action=${action}`, pool);
  },

  /**
   * 管理路由
   */
  async manageRoute(nwid: string, route: RouteRequest, action: 'add' | 'delete'): Promise<ApiResponse<{ network: Network }>> {
    return api.post(`/networks/${nwid}/routes?action=${action}`, route);
  },

  /**
   * 更新DNS配置
   */
  async updateDNS(nwid: string, dns: DNSRequest): Promise<ApiResponse<{ network: Network }>> {
    return api.put(`/networks/${nwid}/dns`, dns);
  },

  /**
   * 获取网络状态
   */
  async getStatus(nwid: string): Promise<ApiResponse<{ network: Network; peers: any[] }>> {
    return api.get(`/networks/${nwid}/status`);
  }
};