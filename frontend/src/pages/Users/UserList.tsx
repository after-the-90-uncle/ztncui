import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { userApi } from '../../services/userService';
import { appStore } from '../../store/authStore';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { user: currentUser } = appStore.auth;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (values: any) => {
    try {
      await userApi.createUser(values);
      message.success('用户创建成功');
      setModalVisible(false);
      form.resetFields();
      loadUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建用户失败');
    }
  };

  const handleEditUser = async (values: any) => {
    if (!editingUser) return;
    
    try {
      await userApi.updateUser(editingUser.id, values);
      message.success('用户更新成功');
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      loadUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userApi.deleteUser(userId);
      message.success('用户删除成功');
      loadUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除用户失败');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <Space>
          <UserOutlined />
          {username}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role === 'admin' ? 'red' : 'blue';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '活跃' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            disabled={record.id === currentUser?.id}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            disabled={record.id === currentUser?.id}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.id === currentUser?.id}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>用户管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingUser ? handleEditUser : handleAddUser}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 50, message: '用户名长度应在3-50个字符之间' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: !editingUser, message: '请输入密码' },
              { min: 8, message: '密码长度至少8位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: !editingUser, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Input placeholder="user 或 admin" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="is_active"
            initialValue={true}
          >
            <Input placeholder="true 或 false" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;