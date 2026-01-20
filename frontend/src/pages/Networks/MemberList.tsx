import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Switch, Space, message,
  Popconfirm, Tag, Card, Row, Col, Badge, Avatar, Tooltip, Divider
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined,
  CheckOutlined, CloseOutlined, WifiOutlined, ReloadOutlined,
  SearchOutlined, FilterOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { networkService } from '@/services/networkService';
import type { NetworkMember } from '@/types/api';

interface MemberFormData {
  name: string;
  description: string;
  authorized: boolean;
  tags?: any[];
}

const MemberList: React.FC = () => {
  const { nwid } = useParams<{ nwid: string }>();
  const navigate = useNavigate();
  const [members, setMembers] = useState<NetworkMember[]>([]);
  const [network, setNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<NetworkMember | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'authorized' | 'pending' | 'online'>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    if (nwid) {
      loadData();
    }
  }, [nwid]);

  const loadData = async () => {
    if (!nwid) return;
    
    setLoading(true);
    try {
      const [networkResponse, membersResponse] = await Promise.all([
        networkService.getNetwork(nwid),
        networkService.getMembers(nwid)
      ]);

      if (networkResponse.success) {
        setNetwork(networkResponse.data);
      }
      
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      }
    } catch (error: any) {
      message.error('加载数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (memberId: string, authorized: boolean) => {
    try {
      const response = await networkService.updateMember(nwid!, memberId, { authorized });
      if (response.success) {
        message.success(authorized ? '成员授权成功' : '成员撤销授权成功');
        loadData();
      }
    } catch (error: any) {
      message.error('操作失败: ' + error.message);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await networkService.deleteMember(nwid!, memberId);
      if (response.success) {
        message.success('成员删除成功');
        loadData();
      }
    } catch (error: any) {
      message.error('删除失败: ' + error.message);
    }
  };

  const handleAddMember = async (values: MemberFormData) => {
    try {
      const response = await networkService.addMember(nwid!, {
        ...values,
        address: values.name
      });
      if (response.success) {
        message.success('成员添加成功');
        setModalVisible(false);
        form.resetFields();
        loadData();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '添加成员失败');
    }
  };

  const handleEditMember = async (values: MemberFormData) => {
    if (!editingMember) return;
    
    try {
      const response = await networkService.updateMember(nwid!, editingMember.id, values);
      if (response.success) {
        message.success('成员信息更新成功');
        setModalVisible(false);
        setEditingMember(null);
        form.resetFields();
        loadData();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新成员失败');
    }
  };

  const openEditModal = (member: NetworkMember) => {
    setEditingMember(member);
    form.setFieldsValue({
      name: member.name || member.address,
      description: member.description || '',
      authorized: member.authorized,
      tags: member.tags || []
    });
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingMember(null);
    form.resetFields();
    form.setFieldsValue({ authorized: false });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingMember(null);
    form.resetFields();
  };

  const getFilteredMembers = () => {
    let filtered = members;

    if (searchText) {
      filtered = filtered.filter(member => 
        member.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        member.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    switch (filterStatus) {
      case 'authorized':
        filtered = filtered.filter(member => member.authorized);
        break;
      case 'pending':
        filtered = filtered.filter(member => !member.authorized);
        break;
      case 'online':
        filtered = filtered.filter(member => member.online);
        break;
      default:
        break;
    }

    return filtered;
  };

  const getStatusColor = (member: NetworkMember) => {
    if (!member.authorized) return 'orange';
    if (member.online) return 'green';
    return 'blue';
  };

  const getStatusText = (member: NetworkMember) => {
    if (!member.authorized) return '待授权';
    if (member.online) return '在线';
    return '离线';
  };

  const columns = [
    {
      title: '成员',
      key: 'member',
      render: (record: NetworkMember) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: record.online ? '#52c41a' : '#d9d9d9' 
            }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.name || '未命名'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.address}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (record: NetworkMember) => (
        <Tag color={getStatusColor(record)} icon={<WifiOutlined />}>
          {getStatusText(record)}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      key: 'ip',
      render: (record: NetworkMember) => (
        <div>
          {record.ipAssignments?.map((ip, index) => (
            <div key={index}>
              <code style={{ 
                background: '#f0f0f0', 
                padding: '2px 4px', 
                borderRadius: 3,
                fontSize: '11px'
              }}>
                {ip}
              </code>
            </div>
          )) || '-'}
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
      ellipsis: true,
    },
    {
      title: '最后在线',
      key: 'lastOnline',
      render: (record: NetworkMember) => {
        if (record.lastOnline) {
          return new Date(record.lastOnline).toLocaleString('zh-CN');
        }
        return '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: NetworkMember) => (
        <Space size="small">
          <Tooltip title={record.authorized ? '撤销授权' : '授权'}>
            <Button
              size="small"
              type={record.authorized ? 'default' : 'primary'}
              icon={record.authorized ? <CloseOutlined /> : <CheckOutlined />}
              onClick={() => handleAuthorize(record.id, !record.authorized)}
            />
          </Tooltip>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个成员吗？"
            onConfirm={() => handleDeleteMember(record.id)}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredMembers = getFilteredMembers();

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>成员管理</h2>
            <p style={{ color: '#666', margin: '4px 0' }}>
              网络: {network?.name || '未知网络'} ({nwid})
            </p>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              添加成员
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索成员名称或地址"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                outline: 'none'
              }}
            >
              <option value="all">全部成员</option>
              <option value="authorized">已授权</option>
              <option value="pending">待授权</option>
              <option value="online">在线成员</option>
            </select>
          </Col>
          <Col span={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Space>
              <Badge count={members.filter(m => m.authorized).length} color="green">
                <span style={{ marginRight: 8 }}>已授权</span>
              </Badge>
              <Badge count={members.filter(m => !m.authorized).length} color="orange">
                <span style={{ marginRight: 8 }}>待授权</span>
              </Badge>
              <Badge count={members.filter(m => m.online).length} color="blue">
                <span style={{ marginRight: 8 }}>在线</span>
              </Badge>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredMembers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingMember ? '编辑成员' : '添加成员'}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingMember ? handleEditMember : handleAddMember}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="成员标识"
                name="name"
                rules={[
                  { required: true, message: '请输入成员标识' },
                  { max: 50, message: '成员标识不能超过50个字符' }
                ]}
              >
                <Input placeholder="成员名称或地址标识" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="授权状态"
                name="authorized"
                valuePropName="checked"
              >
                <Switch checkedChildren="已授权" unCheckedChildren="未授权" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="成员描述"
            name="description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="输入成员描述信息"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Divider />

          <div style={{ fontSize: '12px', color: '#666', marginBottom: 16 }}>
            <strong>说明：</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
              <li>成员标识将用于显示成员名称</li>
              <li>只有授权的成员才能访问网络</li>
              <li>成员需要先加入网络（使用ZeroTier客户端）才能显示在此列表中</li>
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberList;