import React from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';

interface LoadingProps extends SpinProps {
  tip?: string;
}

const Loading: React.FC<LoadingProps> = ({ tip, size, ...props }) => {
  return (
    <div className="loading-container">
      <Spin size={size || 'default'} tip={tip || '加载中...'} {...props} />
    </div>
  );
};

export default Loading;