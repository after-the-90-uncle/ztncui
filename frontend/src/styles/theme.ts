import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const themeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  components: {
    Layout: {
      headerBg: '#fff',
      siderBg: '#fff',
      bodyBg: '#f0f2f5'
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff'
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#595959'
    },
    Button: {
      borderRadius: 6
    },
    Input: {
      borderRadius: 6
    },
    Select: {
      borderRadius: 6
    },
    Modal: {
      borderRadius: 8
    }
  }
};