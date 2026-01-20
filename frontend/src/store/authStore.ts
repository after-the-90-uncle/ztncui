import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';
import type { User } from '@/types/api';

interface AuthState {
  // 用户状态
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  
  // 认证状态
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // 权限状态
  isAdmin: boolean;
}

interface AuthActions {
  // 认证相关操作
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateRefreshToken: (token: string, refreshToken: string) => void;
  
  // 状态更新
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: User) => void;
  
  // 初始化
  initializeAuth: () => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const authStore = proxy<AuthStore>({
  // 初始状态
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isAdmin: false,
  
  // 认证操作
  login: (token: string, refreshToken: string, user: User) => {
    authStore.user = user;
    authStore.token = token;
    authStore.refreshToken = refreshToken;
    authStore.isAuthenticated = true;
    authStore.isAdmin = user.role === 'admin';
    authStore.error = null;
    
    // 保存到本地存储
    localStorage.setItem('ztncui_token', token);
    localStorage.setItem('ztncui_refresh_token', refreshToken);
    localStorage.setItem('ztncui_user', JSON.stringify(user));
  },
  
  logout: () => {
    // 清除状态
    authStore.user = null;
    authStore.token = null;
    authStore.refreshToken = null;
    authStore.isAuthenticated = false;
    authStore.isAdmin = false;
    authStore.error = null;
    
    // 清除本地存储
    localStorage.removeItem('ztncui_token');
    localStorage.removeItem('ztncui_refresh_token');
    localStorage.removeItem('ztncui_user');
  },
  
  updateRefreshToken: (token: string, refreshToken: string) => {
    authStore.token = token;
    authStore.refreshToken = refreshToken;
    
    // 更新本地存储
    localStorage.setItem('ztncui_token', token);
    localStorage.setItem('ztncui_refresh_token', refreshToken);
  },
  
  setLoading: (loading: boolean) => {
    authStore.loading = loading;
  },
  
  setError: (error: string | null) => {
    authStore.error = error;
  },
  
  updateUser: (user: User) => {
    authStore.user = user;
    authStore.isAdmin = user.role === 'admin';
    
    // 更新本地存储
    localStorage.setItem('ztncui_user', JSON.stringify(user));
  },
  
  initializeAuth: () => {
    try {
      const token = localStorage.getItem('ztncui_token');
      const refreshToken = localStorage.getItem('ztncui_refresh_token');
      const userStr = localStorage.getItem('ztncui_user');
      
      if (token && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        authStore.token = token;
        authStore.refreshToken = refreshToken;
        authStore.user = user;
        authStore.isAuthenticated = true;
        authStore.isAdmin = user.role === 'admin';
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authStore.clearAuth();
    }
  },
  
  clearAuth: () => {
    authStore.user = null;
    authStore.token = null;
    authStore.refreshToken = null;
    authStore.isAuthenticated = false;
    authStore.isAdmin = false;
    authStore.error = null;
    
    localStorage.removeItem('ztncui_token');
    localStorage.removeItem('ztncui_refresh_token');
    localStorage.removeItem('ztncui_user');
  }
});

// 启用开发工具
devtools(authStore, { name: 'auth-store' });

export const appStore = {
  auth: authStore
};

// 初始化认证状态
authStore.initializeAuth();