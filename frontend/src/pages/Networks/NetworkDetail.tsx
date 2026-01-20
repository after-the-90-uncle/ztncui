import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Descriptions, Form, Input, Switch, Button, 
  Space, message, Tabs, Divider, Badge, Spin 
} from 'antd';
import { 
  SaveOutlined, ReloadOutlined, SettingOutlined, 
  UserOutlined, GlobalOutlined, SecurityScanOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { networkService } from '@/services/networkService';
import type { Network } from '@/types/api';

const { TabPane } = Tabs;

const NetworkDetail: React.FC = () => {
  const { nwid } = useParams<{ nwid: string }>();
  const navigate = useNavigate();
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (nwid) {
      loadNetworkDetail();
    }
  }, [nwid]);

  const loadNetworkDetail = async () => {
    if (!nwid) return;
    
    setLoading(true);
    try {
      const response = await networkService.getNetwork(nwid);
      if (response.success && response.data) {
        setNetwork(response.data);
        form.setFieldsValue({
          name: response.data.name,
          description: response.data.description || '',
          private: response.data.private,
          v4AssignMode: response.data.v4AssignMode?.zt,
          v6AssignMode: response.data.v6AssignMode?.zt,
          dnsServer: response.data.dns?.servers?.join(', ') || '',
        });
      }
    } catch (error: any) {
      message.error('加载网络详情失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!network) return;

    setSaving(true);
    try {
      const updateData = {
        ...values,
        dns: values.dnsServer ? {
          servers: values.dnsServer.split(',').map((server: string) => server.trim()),
          domain: 'zerotier.local'
        } : undefined
      };

      const response = await networkService.updateNetwork(network.nwid, updateData);
      if (response.success) {
        message.success('网络配置更新成功');
        loadNetworkDetail();
      }
    } catch (error: any) {
      message.error('更新网络失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAddress = async () => {
    try {
      const response = await networkService.generateNetworkAddress();
      if (response.success && response.data) {
        form.setFieldValue('nwid', response.data.nwid);
        message.success('网络地址生成成功');
      }
    } catch (error: any) {
      message.error('生成网络地址失败: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!network) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <p>网络不存在或已删除</p>
        <Button type="primary" onClick={() => navigate('/networks')}>
          返回网络列表
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>{network.name || '未命名网络'}</h2>
          <p style={{ color: '#666', margin: '4px 0' }}>网络ID: {network.nwid}</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadNetworkDetail}>
            刷新
          </Button>
          <Button 
            type="primary" 
            icon={<UserOutlined />}
            onClick={() => navigate(`/networks/${network.nwid}/members`)}
          >
            管理成员
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="basic" size="large">
        <TabPane tab="基本信息" key="basic" icon={<SettingOutlined />}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="网络名称"
                    name="name"
                    rules={[
                      { required: true, message: '请输入网络名称' },
                      { max: 100, message: '网络名称不能超过100个字符' }
                    ]}
                  >
                    <Input placeholder="输入网络名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="网络地址"
                    name="nwid"
                  >
                    <Input 
                      value={network.nwid} 
                      readOnly 
                      addonAfter={
                        <Button 
                          size="small" 
                          onClick={handleGenerateAddress}
                          style={{ margin: '-5px -12px' }}
                        >
                          生成
                        </Button>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="网络描述"
                name="description"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="输入网络描述信息"
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    label="私有网络"
                    name="private"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                    私有网络需要授权才能加入
                  </p>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="IPv4模式"
                    name="v4AssignMode"
                  >
                    <Input placeholder="zt" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="IPv6模式"
                    name="v6AssignMode"
                  >
                    <Input placeholder="zt" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              
              <Row>
                <Col span={24}>
                  <h4 style={{ marginBottom: 16 }}>
                    <GlobalOutlined style={{ marginRight: 8 }} />
                    DNS配置
                  </h4>
                  <Form.Item
                    label="DNS服务器"
                    name="dnsServer"
                    extra="多个服务器请用逗号分隔，如：8.8.8.8, 8.8.4.4"
                  >
                    <Input placeholder="输入DNS服务器地址" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    保存配置
                  </Button>
                  <Button onClick={() => loadNetworkDetail()}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="网络状态" key="status" icon={<SecurityScanOutlined />}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="IPv4配置" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="分配模式">
                    <Badge status="processing" text={network.v4AssignMode?.zt || '未配置'} />
                  </Descriptions.Item>
                  <Descriptions.Item label="IP池">
                    {network.ipAssignmentPools?.[0]?.ipRangeStart || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="IP池结束">
                    {network.ipAssignmentPools?.[0]?.ipRangeEnd || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="IPv6配置" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="分配模式">
                    <Badge status="processing" text={network.v6AssignMode?.zt || '未配置'} />
                  </Descriptions.Item>
                  <Descriptions.Item label="子网前缀">
                    {network.v6AssignPrefix || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="路由">
                    {network.routes?.length || 0} 条路由
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Card title="成员统计" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {network.members?.filter(m => m.authorized).length || 0}
                    </div>
                    <div style={{ color: '#666' }}>已授权成员</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                      {network.members?.filter(m => !m.authorized).length || 0}
                    </div>
                    <div style={{ color: '#666' }}>待授权成员</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {network.members?.filter(m => m.online).length || 0}
                    </div>
                    <div style={{ color: '#666' }}>在线成员</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="路由配置" key="routes">
          <Card>
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
              <p>路由配置功能正在开发中</p>
              <p>将在后续版本中提供路由管理功能</p>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default NetworkDetail;