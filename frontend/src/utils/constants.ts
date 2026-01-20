// 常量定义

export const API_BASE_URL = '/api';

// 网络相关
export const NETWORK_PRIVATE = {
  TRUE: true,
  FALSE: false
} as const;

export const ASSIGN_MODE = {
  ZEROTIER: 'zerotier',
  ZT: 'zt',
  DHCP: 'dhcp'
} as const;

// 菜单项
export const MENU_ITEMS = [
  {
    key: '/dashboard',
    label: '仪表盘',
    icon: 'dashboard'
  },
  {
    key: '/networks',
    label: '网络管理',
    icon: 'network'
  },
  {
    key: '/users',
    label: '用户管理',
    icon: 'user',
    adminOnly: true
  }
] as const;

// 错误代码
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  NETWORK_NOT_FOUND: 'NETWORK_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

// 正则表达式
export const REGEX = {
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  IP_ADDRESS: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  CIDR: /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[12][0-9]|3[0-2])$/,
  NETWORK_ID: /^[a-fA-F0-9]{16}$/,
  MEMBER_ID: /^[a-fA-F0-9]{10}$/
} as const;

// 验证规则
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 10,
  NAME_MAX_LENGTH: 100
} as const;