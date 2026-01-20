import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { appStore } from '@/store/authStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSnapshot(appStore.auth);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘'
    },
    {
      key: '/networks',
      icon: <CloudServerOutlined />,
      label: '网络管理'
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      disabled: !authState.isAdmin
    }
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        appStore.auth.logout();
        navigate('/login');
        break;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/dashboard';

  return (
    <Layout className="main-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={200}
        theme="light"
      >
        <div className="logo">
          <WifiOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 8 }} />
          {!collapsed && <span className="logo-text">ztncui</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header className="site-layout-background" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <div className="user-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span>{authState.user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8
          }}
        >
          {children}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;