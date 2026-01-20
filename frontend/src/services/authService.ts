import { api } from './api';
import type { LoginRequest, LoginResponse, ApiResponse, User } from '@/types/api';

export const authService = {
  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return api.post('/auth/login', credentials);
  },

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse> {
    return api.post('/auth/logout');
  },

  /**
   * 获取用户信息
   */
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return api.get('/auth/profile');
  },

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    return api.post('/auth/refresh', { refreshToken });
  },

  /**
   * 修改密码
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  /**
   * 设置初始密码
   */
  async setPassword(password: string): Promise<ApiResponse> {
    return api.post('/auth/set-password', { password });
  }
};