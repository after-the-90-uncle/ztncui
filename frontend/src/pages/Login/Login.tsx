import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { appStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import type { LoginRequest } from '@/types/api';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authState = useSnapshot(appStore.auth);

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      
      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;
        appStore.auth.login(token, refreshToken, user);
        
        // 如果用户需要设置初始密码，跳转到密码设置页面
        if (!user.passSet) {
          navigate('/set-password');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      appStore.auth.setError(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{ width: 400, maxWidth: '90vw' }}
      variant="borderless"
      styles={{ body: { padding: '40px 32px' } }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: '#262626' }}>登录</h2>
        <p style={{ margin: '8px 0 0', color: '#8c8c8c' }}>
          请输入您的用户名和密码
        </p>
      </div>

      {authState.error && (
        <Alert
          message="登录失败"
          description={authState.error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          closable
          onClose={() => appStore.auth.setError(null)}
        />
      )}

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: 44 }}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <p style={{ color: '#8c8c8c', fontSize: 12 }}>
          默认管理员账户：admin / password
        </p>
        <p style={{ color: '#8c8c8c', fontSize: 12 }}>
          首次登录后请修改密码
        </p>
      </div>
    </Card>
  );
};

export default Login;