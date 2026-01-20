import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    });

    // 在生产环境中，可以发送错误报告到服务器
    if (process.env.NODE_ENV === 'production') {
      console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
      // 这里可以集成错误监控服务
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Result
            status="error"
            title="页面出现错误"
            subTitle={
              this.state.error?.message || 
              '抱歉，应用程序遇到了意外错误。请尝试刷新页面或联系管理员。'
            }
            extra={[
              <Button key="reset" onClick={this.handleReset}>
                重试
              </Button>,
              <Button key="reload" type="primary" onClick={this.handleReload}>
                刷新页面
              </Button>
            ]}
            icon={<ExclamationCircleOutlined />}
          />
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: '#f6f8fa', 
              padding: '16px', 
              fontFamily: 'monospace',
              fontSize: '12px',
              borderTop: '1px solid #d0d7de'
            }}>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  错误详情 (开发模式)
                </summary>
                <pre>{this.state.error.stack}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;