import React from 'react';
import { Layout } from 'antd';
import { WifiOutlined } from '@ant-design/icons';

const { Content } = Layout;

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-container">
          <div className="login-header">
            <WifiOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <h1 style={{ color: '#fff', margin: 0, fontSize: 32, fontWeight: 600 }}>
              ztncui
            </h1>
            <p style={{ color: '#fff', opacity: 0.8, margin: '8px 0 0', fontSize: 16 }}>
              ZeroTier 网络控制器
            </p>
          </div>
          <div className="login-content">
            {children}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginLayout;