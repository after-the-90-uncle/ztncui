import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { appStore } from '@/store/authStore';

export const useAuth = () => {
  const authState = useSnapshot(appStore.auth);

  // 初始化认证状态
  useEffect(() => {
    if (!authState.isAuthenticated) {
      appStore.auth.initializeAuth();
    }
  }, []);

  return {
    // 认证状态
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    loading: authState.loading,
    error: authState.error,
    
    // 认证操作
    login: appStore.auth.login,
    logout: appStore.auth.logout,
    refreshToken: appStore.auth.refreshToken,
    setError: appStore.auth.setError,
    updateUser: appStore.auth.updateUser
  };
};