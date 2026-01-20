import { api } from './api';
import type { User, ApiResponse } from '@/types/api';

interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}

export const userApi = {
  /**
   * 获取用户列表
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return api.get('/users');
  },

  /**
   * 创建用户
   */
  async createUser(data: UserCreateRequest): Promise<ApiResponse<{ user: User }>> {
    return api.post('/users', data);
  },

  /**
   * 更新用户
   */
  async updateUser(id: string, data: UserUpdateRequest): Promise<ApiResponse<{ user: User }>> {
    return api.put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    return api.delete(`/users/${id}`);
  },

  /**
   * 获取用户详情
   */
  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    return api.get(`/users/${id}`);
  },

  /**
   * 更改用户密码
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return api.post(`/users/${id}/password`, {
      currentPassword,
      newPassword
    });
  },

  /**
   * 重置用户密码
   */
  async resetPassword(id: string, newPassword: string): Promise<ApiResponse> {
    return api.post(`/users/${id}/reset-password`, {
      newPassword
    });
  },

  /**
   * 激活/禁用用户
   */
  async toggleUserStatus(id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> {
    return api.put(`/users/${id}/status`, { is_active: isActive });
  }
};