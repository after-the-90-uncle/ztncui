import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Popconfirm, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { networkService } from '@/services/networkService';
import type { Network } from '@/types/api';

const NetworkList: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newNetworkName, setNewNetworkName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    setLoading(true);
    try {
      const response = await networkService.getNetworks();
      if (response.success && response.data) {
        setNetworks(response.data.networks);
      }
    } catch (error: any) {
      message.error('加载网络列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNetwork = async () => {
    if (!newNetworkName.trim()) {
      message.error('请输入网络名称');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await networkService.createNetwork({ name: newNetworkName.trim() });
      if (response.success) {
        message.success('网络创建成功');
        setCreateModalVisible(false);
        setNewNetworkName('');
        loadNetworks();
      }
    } catch (error: any) {
      message.error('创建网络失败: ' + error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteNetwork = async (nwid: string, name: string) => {
    try {
      const response = await networkService.deleteNetwork(nwid);
      if (response.success) {
        message.success(`网络 "${name}" 删除成功`);
        loadNetworks();
      }
    } catch (error: any) {
      message.error('删除网络失败: ' + error.message);
    }
  };

  const columns: ColumnsType<Network> = [
    {
      title: '网络名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Network) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/networks/${record.nwid}/detail`)}
          style={{ padding: 0 }}
        >
          {text || '未命名网络'}
        </Button>
      )
    },
    {
      title: '网络ID',
      dataIndex: 'nwid',
      key: 'nwid',
      render: (nwid: string) => (
        <code style={{ 
          background: '#f0f0f0', 
          padding: '2px 6px', 
          borderRadius: 4,
          fontSize: '12px'
        }}>
          {nwid}
        </code>
      )
    },
    {
      title: '状态',
      dataIndex: 'private',
      key: 'status',
      render: (isPrivate: boolean) => (
        <Tag color={isPrivate ? 'red' : 'green'}>
          {isPrivate ? '私有' : '公开'}
        </Tag>
      )
    },
    {
      title: 'IPv4模式',
      dataIndex: 'v4AssignMode',
      key: 'v4AssignMode',
      render: (mode: string) => (
        <Tag color="blue">{mode}</Tag>
      )
    },
    {
      title: 'IPv6模式',
      dataIndex: 'v6AssignMode',
      key: 'v6AssignMode',
      render: (mode: string) => (
        <Tag color="purple">{mode}</Tag>
      )
    },
    {
      title: '成员数',
      key: 'memberCount',
      render: (_, record: Network) => (
        <Button 
          type="link"
          icon={<UsergroupAddOutlined />}
          onClick={() => navigate(`/networks/${record.nwid}/members`)}
        >
          查看成员
        </Button>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Network) => (
        <Space>
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/networks/${record.nwid}/detail`)}
          >
            配置
          </Button>
          <Popconfirm
            title="确定要删除这个网络吗？"
            description="删除后无法恢复，该网络下的所有成员将被移除。"
            onConfirm={() => handleDeleteNetwork(record.nwid, record.name)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title="网络管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建网络
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={networks}
        rowKey="nwid"
        loading={loading}
        pagination={false}
      />

      <Modal
        title="创建新网络"
        open={createModalVisible}
        onOk={handleCreateNetwork}
        onCancel={() => {
          setCreateModalVisible(false);
          setNewNetworkName('');
        }}
        confirmLoading={createLoading}
        okText="创建"
        cancelText="取消"
      >
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            网络名称
          </label>
          <input
            type="text"
            value={newNetworkName}
            onChange={(e) => setNewNetworkName(e.target.value)}
            placeholder="请输入网络名称"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              outline: 'none'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateNetwork();
              }
            }}
            autoFocus
          />
        </div>
      </Modal>
    </Card>
  );
};

export default NetworkList;