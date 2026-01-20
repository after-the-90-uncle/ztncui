import React, { useState } from 'react';
import { 
  Card, Form, Input, Switch, Button, Steps, Row, Col, 
  Space, message, Divider, Radio, InputNumber, Tooltip 
} from 'antd';
import { 
  CheckOutlined, ArrowLeftOutlined, ArrowRightOutlined,
  GlobalOutlined, SecurityScanOutlined, ServerOutlined as NetworkServerOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { networkService } from '@/services/networkService';

const { TextArea } = Input;
const { Step } = Steps;

interface NetworkConfig {
  name: string;
  description: string;
  private: boolean;
  v4AssignMode: string;
  v6AssignMode: string;
  networkAddress: string;
  ipRangeStart: string;
  ipRangeEnd: string;
  dnsServers: string;
  subnetMask: number;
  gateway: string;
}

const NetworkCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);
  const [networkId, setNetworkId] = useState('');

  const steps = [
    {
      title: '基本信息',
      icon: <NetworkServerOutlined />,
      description: '网络名称和描述'
    },
    {
      title: '网络配置',
      icon: <GlobalOutlined />,
      description: 'IP地址和路由配置'
    },
    {
      title: '安全设置',
      icon: <SecurityScanOutlined />,
      description: '访问控制和权限'
    },
    {
      title: '完成',
      icon: <CheckOutlined />,
      description: '创建网络'
    }
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      message.error('请先完成当前步骤的必填项');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateNetworkId = async () => {
    try {
      const response = await networkService.generateNetworkId();
      if (response.success && response.data) {
        setNetworkId(response.data.nwid);
        form.setFieldsValue({ networkAddress: response.data.nwid });
        message.success('网络ID生成成功');
      }
    } catch (error: any) {
      message.error('生成网络ID失败: ' + error.message);
    }
  };

  const validateNetworkAddress = (rule: any, value: string) => {
    if (!value) return Promise.reject('请输入网络ID');
    if (!/^[0-9a-fA-F]{16}$/.test(value)) {
      return Promise.reject('网络ID应为16位十六进制字符');
    }
    return Promise.resolve();
  };

  const validateIPRange = (rule: any, value: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (value && !ipRegex.test(value)) {
      return Promise.reject('请输入有效的IP地址格式');
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);

      const networkConfig = {
        name: values.name,
        description: values.description || '',
        private: values.private,
        v4AssignMode: { zt: values.v4AssignMode === 'zt' },
        v6AssignMode: { zt: values.v6AssignMode === 'zt' },
        networkId: values.networkAddress || networkId,
        ipAssignmentPools: values.ipRangeStart && values.ipRangeEnd ? [{
          ipRangeStart: values.ipRangeStart,
          ipRangeEnd: values.ipRangeEnd
        }] : [],
        dns: values.dnsServers ? {
          servers: values.dnsServers.split(',').map(server => server.trim()),
          domain: 'zerotier.local'
        } : undefined
      };

      const response = await networkService.createNetwork(networkConfig);
      if (response.success) {
        message.success('网络创建成功！');
        setCurrentStep(3);
      }
    } catch (error: any) {
      message.error('创建网络失败: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="基本信息配置" size="small">
            <Form.Item
              label="网络名称"
              name="name"
              rules={[
                { required: true, message: '请输入网络名称' },
                { min: 2, max: 100, message: '网络名称长度应在2-100个字符之间' }
              ]}
            >
              <Input placeholder="输入一个描述性的网络名称" />
            </Form.Item>

            <Form.Item
              label="网络描述"
              name="description"
            >
              <TextArea 
                rows={3} 
                placeholder="可选：描述网络的用途和相关信息"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="网络ID"
              name="networkAddress"
              rules={[{ validator: validateNetworkAddress }]}
              extra="16位十六进制字符，可点击下方按钮自动生成"
            >
              <Input 
                placeholder="输入网络ID或点击生成"
                addonAfter={
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={handleGenerateNetworkId}
                    style={{ margin: '-5px -12px' }}
                  >
                    生成
                  </Button>
                }
              />
            </Form.Item>
          </Card>
        );

      case 1:
        return (
          <Card title="网络配置" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="IPv4分配模式"
                  name="v4AssignMode"
                  initialValue="zt"
                >
                  <Radio.Group>
                    <Radio value="zt">ZeroTier托管</Radio>
                    <Radio value="none">禁用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="IPv6分配模式"
                  name="v6AssignMode"
                  initialValue="none"
                >
                  <Radio.Group>
                    <Radio value="zt">ZeroTier托管</Radio>
                    <Radio value="none">禁用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="IP池起始地址"
                  name="ipRangeStart"
                  rules={[
                    { required: true, message: '请输入IP池起始地址' },
                    { validator: validateIPRange }
                  ]}
                >
                  <Input placeholder="192.168.100.1" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="IP池结束地址"
                  name="ipRangeEnd"
                  rules={[
                    { required: true, message: '请输入IP池结束地址' },
                    { validator: validateIPRange }
                  ]}
                >
                  <Input placeholder="192.168.100.254" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="子网掩码"
                  name="subnetMask"
                  initialValue={24}
                >
                  <InputNumber
                    min={8}
                    max={30}
                    style={{ width: '100%' }}
                    formatter={value => `/ ${value}`}
                    parser={value => value!.replace('/ ', '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="DNS服务器"
              name="dnsServers"
              extra="多个服务器请用逗号分隔，如：8.8.8.8, 8.8.4.4"
            >
              <Input placeholder="可选：输入DNS服务器地址" />
            </Form.Item>

            <Form.Item
              label="网关地址"
              name="gateway"
            >
              <Input placeholder="可选：输入网关地址" />
            </Form.Item>
          </Card>
        );

      case 2:
        return (
          <Card title="安全设置" size="small">
            <Form.Item
              label="私有网络"
              name="private"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '-16px', marginBottom: '24px' }}>
              私有网络需要手动授权才能加入，安全性更高
            </p>

            <Divider />

            <div style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '8px' }}>安全建议</h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#666' }}>
                <li>对于生产环境，建议启用私有网络</li>
                <li>定期检查和更新网络成员授权</li>
                <li>避免使用默认的DNS服务器</li>
                <li>建议限制IP池范围以提高安全性</li>
              </ul>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card>
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <CheckOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <h3>网络创建成功！</h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                您的网络已成功创建，现在可以开始添加成员了。
              </p>
              <Space>
                <Button type="primary" onClick={() => navigate('/networks')}>
                  返回网络列表
                </Button>
                <Button onClick={() => navigate(`/networks/${networkId}/members`)}>
                  管理网络成员
                </Button>
              </Space>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/networks')}
          style={{ marginRight: 8 }}
        >
          返回
        </Button>
        <h2 style={{ display: 'inline' }}>创建新网络</h2>
      </div>

      <Card>
        <Steps 
          current={currentStep} 
          style={{ marginBottom: '32px' }}
          items={steps.map(step => ({
            title: step.title,
            description: step.description,
            icon: step.icon
          }))}
        />

        <div style={{ minHeight: '300px' }}>
          {renderStepContent()}
        </div>

        {currentStep < 3 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Space>
              {currentStep > 0 && (
                <Button icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 2 ? (
                <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleNext}>
                  下一步
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />} 
                  onClick={handleSubmit}
                  loading={creating}
                >
                  创建网络
                </Button>
              )}
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NetworkCreate;