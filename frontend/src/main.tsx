import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App';
import { themeConfig } from './styles/theme';
import './styles/global.less';

// 配置 dayjs 中文语言
dayjs.locale('zh-cn');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: themeConfig.algorithm,
        token: themeConfig.tokens,
        components: themeConfig.components
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);