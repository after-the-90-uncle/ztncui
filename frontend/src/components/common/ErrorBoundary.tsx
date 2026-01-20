import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <Result
            status="500"
            title="页面出现错误"
            subTitle="抱歉，页面遇到了意外错误。请刷新页面或联系管理员。"
            extra={
              <div>
                <Button type="primary" onClick={this.handleRefresh} style={{ marginRight: 8 }}>
                  刷新页面
                </Button>
                <Button onClick={this.handleGoHome}>
                  返回首页
                </Button>
              </div>
            }
          />
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
              <details>
                <summary style={{ cursor: 'pointer' }}>错误详情</summary>
                <pre style={{ marginTop: 8, fontSize: 12 }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;