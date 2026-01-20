import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { appStore } from '@/store/authStore';
import type { ApiResponse } from '@/types/api';

// 创建 axios 实例
const apiInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiInstance.interceptors.request.use(
  (config) => {
    // 添加认证头
    const token = appStore.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 处理401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = appStore.auth.refreshToken;
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken });
          if (response.success && response.data) {
            const { token="", refreshToken: newRefreshToken } = response.data;
            appStore.auth.updateRefreshToken(token, newRefreshToken);
            
            // 重新发送原始请求
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // 刷新令牌失败，清除认证状态
        appStore.auth.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 显示错误信息
    const errorMessage = error.response?.data?.error?.message || error.message || '请求失败';
    message.error(errorMessage);

    return Promise.reject(error);
  }
);

// API 基础类
class ApiClient {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
export { apiInstance };