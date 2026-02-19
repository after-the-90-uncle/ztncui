import React from 'react';
import { Layout } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import ParticleBackground from '../common/ParticleBackground';

const { Content } = Layout;

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32, pointerEvents: 'auto' }}>
          <WifiOutlined style={{ fontSize: 48, color: '#00c8ff', marginBottom: 16 }} />
          <h1 style={{ margin: 0, color: '#fff', fontSize: 32, fontWeight: 600 }}>ztncui</h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>ZeroTier 网络控制器</p>
        </div>
        
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;