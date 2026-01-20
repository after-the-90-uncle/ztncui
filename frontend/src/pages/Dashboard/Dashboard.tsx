import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin } from 'antd';
import { ClusterOutlined, UserOutlined, WifiOutlined, TrophyOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { appStore } from '@/store/authStore';
import { networkService } from '@/services/networkService';

const Dashboard: React.FC = () => {
  const authState = useSnapshot(appStore.auth);
  const [stats, setStats] = useState({
    totalNetworks: 0,
    totalMembers: 0,
    onlineMembers: 0,
    isLoading: true,
    error: null as string | null
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));
      
      const networksResponse = await networkService.getNetworks();
      if (networksResponse.success && networksResponse.data) {
        const networks = networksResponse.data.networks;
        
        // 计算统计数据
        let totalMembers = 0;
        let onlineMembers = 0;
        
        // 并行获取所有网络成员信息
        const membersPromises = networks.map(network => 
          networkService.getMembers(network.nwid)
        );
        
        const membersResults = await Promise.all(membersPromises);
        
        membersResults.forEach(result => {
          if (result.success && result.data) {
            const members = Object.values(result.data.members) as any[];
            totalMembers += members.length;
            onlineMembers += members.filter(m => m.peer && m.peer.lastOnline).length;
          }
        });
        
        setStats({
          totalNetworks: networks.length,
          totalMembers,
          onlineMembers,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '获取统计数据失败'
      }));
    }
  };

  if (stats.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="正在加载仪表盘数据..." />
      </div>
    );
  }

  return (
    <div className="dashboard page-transition">
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          欢迎回来，{authState.user?.name}
        </h1>
        <p style={{ margin: '8px 0 0', color: '#8c8c8c' }}>
          ZeroTier网络控制器仪表盘
        </p>
      </div>

      {stats.error && (
        <Alert
          message="加载失败"
          description={stats.error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          onClose={() => setStats(prev => ({ ...prev, error: null }))}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="网络总数"
              value={stats.totalNetworks}
              prefix={<CloudServerOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="成员总数"
              value={stats.totalMembers}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线成员"
              value={stats.onlineMembers}
              prefix={<WifiOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统状态"
              value="正常"
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="快速操作" variant="borderless">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  hoverable
                  onClick={() => window.location.href = '/networks'}
                  style={{ cursor: 'pointer' }}
                >
                  <CloudServerOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div style={{ fontWeight: 500 }}>管理网络</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    创建和管理ZeroTier网络
                  </div>
                </Card>
              </Col>
              
              {authState.isAdmin && (
                <Col xs={24} md={12}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => window.location.href = '/users'}
                    style={{ cursor: 'pointer' }}
                  >
                    <UserOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                    <div style={{ fontWeight: 500 }}>用户管理</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                      管理用户账户和权限
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;