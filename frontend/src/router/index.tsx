import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { appStore } from '@/store/authStore';
import MainLayout from '@/components/layout/MainLayout';
import LoginLayout from '@/components/layout/LoginLayout';
import { Login, Dashboard, NetworkList } from '@/pages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useSnapshot(appStore.auth);
  
  if (!authState.isAuthenticated) {
    return <Login />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <LoginLayout>
        <Login />
      </LoginLayout>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <div />
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'networks',
        children: [
          {
            index: true,
            element: <NetworkList />
          },
          {
            path: ':nwid/members',
            element: <div>成员管理页面（待开发）</div>
          },
          {
            path: ':nwid/detail',
            element: <div>网络详情页面（待开发）</div>
          }
        ]
      },
      {
        path: 'users',
        element: <div>用户管理页面（待开发）</div>
      }
    ]
  }
]);

const AppRouter: React.FC = () => {
  const authState = useSnapshot(appStore.auth);
  
  if (authState.loading) {
    return null;
  }

  return <RouterProvider router={router} />;
};

export default AppRouter;