import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { appStore } from './store/authStore';
import { useSnapshot } from 'valtio';
import MainLayout from './components/layout/MainLayout';
import LoginLayout from './components/layout/LoginLayout';
import Login from './pages/Login/Login';
import Loading from './components/common/Loading';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import './App.less';

const App: React.FC = () => {
  const authState = useSnapshot(appStore.auth);

  const renderContent = () => {
    if (authState.loading) {
      return <Loading size="large" tip="正在加载..." />;
    }

    if (!authState.isAuthenticated) {
      return (
        <LoginLayout>
          <Login />
        </LoginLayout>
      );
    }

    return (
      <MainLayout>
        <Suspense fallback={<Loading size="large" tip="页面加载中..." />}>
          <div className="app-content">
            {/* 路由内容将通过 Outlet 渲染 */}
          </div>
        </Suspense>
      </MainLayout>
    );
  };

  return (
    <GlobalErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        {renderContent()}
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
};

export default App;