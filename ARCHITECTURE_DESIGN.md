# ztncui 前后端分离架构设计方案

## 项目概述

ztncui 是一个 ZeroTier 网络控制器用户界面，当前采用 Node.js + Express + Pug 的传统单体架构。本次重构将实现前后端完全分离，打造现代化的企业级前端工程。

## 当前架构分析

### 技术栈
- **后端**: Node.js + Express + Pug模板引擎
- **前端**: Bootstrap 3.4.1 + jQuery 3.4.1
- **数据库**: 文件存储 (JSON)
- **状态管理**: Express Session
- **API通信**: got库与ZeroTier API交互

### 主要功能模块
1. **用户认证管理**: 登录、密码修改、用户CRUD
2. **网络管理**: 网络创建、删除、配置、详细信息
3. **成员管理**: 成员授权、IP分配、详细信息
4. **网络配置**: IP分配池、路由、DNS、IPv4/IPv6模式
5. **简单设置**: 网络自动配置功能

## 重构后架构设计

### 整体架构

```
┌─────────────────┐    HTTP/RESTful API    ┌─────────────────┐
│   React Frontend │ ←────────────────────→ │  Node.js Backend │
│                 │                        │                 │
│ - React + TS    │                        │ - Express API   │
│ - Ant Design    │                        │ - ZeroTier API  │
│ - Valtio Store  │                        │ - JWT Auth      │
│ - React Router  │                        │ - Session Mgmt  │
└─────────────────┘                        └─────────────────┘
```

### 后端架构 (Pure API Server)

#### 技术选型
- **框架**: Express.js (保留现有技术栈)
- **认证**: JWT Token + Session混合认证
- **数据存储**: 文件存储 (保持兼容)
- **API文档**: Swagger/OpenAPI 3.0

#### 目录结构
```
backend/
├── controllers/          # 业务控制器
│   ├── authController.js
│   ├── userController.js
│   ├── networkController.js
│   └── memberController.js
├── routes/              # 路由定义
│   ├── auth.js
│   ├── users.js
│   ├── networks.js
│   └── members.js
├── services/            # 业务服务层
│   ├── zerotierService.js
│   ├── userService.js
│   └── jwtService.js
├── middleware/          # 中间件
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/              # 数据模型
│   ├── User.js
│   └── Network.js
├── utils/               # 工具函数
│   ├── validators.js
│   └── helpers.js
├── config/              # 配置文件
│   └── index.js
└── server.js            # 应用入口
```

#### API接口设计

##### 认证相关
```
POST   /api/auth/login           # 用户登录
POST   /api/auth/logout          # 用户登出
GET    /api/auth/profile         # 获取用户信息
POST   /api/auth/refresh         # 刷新Token
```

##### 用户管理
```
GET    /api/users                # 获取用户列表
POST   /api/users                # 创建用户
GET    /api/users/:id            # 获取用户详情
PUT    /api/users/:id            # 更新用户
DELETE /api/users/:id            # 删除用户
POST   /api/users/:id/password   # 修改密码
```

##### 网络管理
```
GET    /api/networks             # 获取网络列表
POST   /api/networks             # 创建网络
GET    /api/networks/:id         # 获取网络详情
PUT    /api/networks/:id         # 更新网络配置
DELETE /api/networks/:id         # 删除网络
GET    /api/networks/:id/members # 获取网络成员
POST   /api/networks/:id/easy    # 网络简单设置
```

##### 成员管理
```
GET    /api/networks/:nid/members/:id          # 获取成员详情
PUT    /api/networks/:nid/members/:id          # 更新成员信息
POST   /api/networks/:nid/members/:id/authorize # 授权成员
POST   /api/networks/:nid/members/:id/deauthorize # 取消授权
POST   /api/networks/:nid/members/:id/ip         # 分配IP
DELETE /api/networks/:nid/members/:id/ip/:ip     # 删除IP分配
DELETE /api/networks/:nid/members/:id             # 删除成员
```

##### 网络配置
```
POST   /api/networks/:id/pools          # IP分配池管理
POST   /api/networks/:id/routes         # 路由管理
POST   /api/networks/:id/dns           # DNS配置
PUT    /api/networks/:id/private       # 私有网络设置
PUT    /api/networks/:id/v4AssignMode  # IPv4分配模式
PUT    /api/networks/:id/v6AssignMode  # IPv6分配模式
```

### 前端架构 (React Application)

#### 技术选型
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI框架**: Ant Design 5.x
- **状态管理**: Valtio
- **路由**: React Router 6
- **HTTP客户端**: Axios
- **样式**: CSS Modules + Less

#### 目录结构
```
frontend/
├── public/                    # 静态资源
├── src/
│   ├── components/            # 通用组件
│   │   ├── common/           # 基础组件
│   │   ├── forms/            # 表单组件
│   │   ├── layout/           # 布局组件
│   │   └── business/         # 业务组件
│   ├── pages/                # 页面组件
│   │   ├── Login/            # 登录页
│   │   ├── Dashboard/        # 仪表盘
│   │   ├── Networks/         # 网络管理
│   │   ├── Members/          # 成员管理
│   │   └── Users/            # 用户管理
│   ├── store/                # 状态管理
│   │   ├── authStore.ts      # 认证状态
│   │   ├── networkStore.ts   # 网络状态
│   │   ├── userStore.ts      # 用户状态
│   │   └── uiStore.ts        # UI状态
│   ├── services/             # API服务
│   │   ├── api/              # API接口定义
│   │   ├── authService.ts    # 认证服务
│   │   ├── networkService.ts # 网络服务
│   │   └── userService.ts    # 用户服务
│   ├── hooks/                # 自定义Hooks
│   │   ├── useAuth.ts        # 认证Hook
│   │   ├── useNetwork.ts     # 网络Hook
│   │   └── useApi.ts         # API Hook
│   ├── utils/                # 工具函数
│   │   ├── constants.ts      # 常量定义
│   │   ├── helpers.ts        # 帮助函数
│   │   └── validators.ts     # 验证器
│   ├── types/                # TypeScript类型
│   │   ├── api.ts            # API类型
│   │   ├── auth.ts           # 认证类型
│   │   ├── network.ts        # 网络类型
│   │   └── user.ts           # 用户类型
│   ├── styles/               # 样式文件
│   │   ├── global.less       # 全局样式
│   │   ├── theme.less        # 主题配置
│   │   └── components.less   # 组件样式
│   ├── App.tsx               # 根组件
│   └── main.tsx              # 入口文件
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 状态管理设计 (Valtio)

### 全局状态结构
```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// store/networkStore.ts
interface NetworkState {
  networks: Network[];
  currentNetwork: Network | null;
  members: Member[];
  loading: boolean;
  error: string | null;
}

// store/uiStore.ts
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  notifications: Notification[];
}
```

### 状态管理原则
1. **页面状态**: 仅在页面组件内部使用useState
2. **全局状态**: 用户信息、网络列表等使用Valtio
3. **临时状态**: 表单数据、加载状态等使用组件内状态
4. **服务器状态**: API数据使用React Query或SWR管理

## 前后端数据交互协议

### 请求格式
```typescript
interface ApiRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: T;
  headers?: Record<string, string>;
}
```

### 响应格式
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}
```

### 错误处理
- **400**: 请求参数错误
- **401**: 未授权访问
- **403**: 权限不足
- **404**: 资源不存在
- **500**: 服务器内部错误

## 安全性考虑

### 认证安全
- JWT Token + Refresh Token机制
- Token过期自动刷新
- 敏感操作需要重新验证

### API安全
- CORS跨域配置
- 请求频率限制
- 输入数据验证和清理
- SQL注入防护

### 数据安全
- 用户密码argon2哈希存储
- 敏感数据加密传输
- 文件访问权限控制

## 迁移策略

### 阶段一: 后端API化 (1-2周)
1. 提取现有业务逻辑到API控制器
2. 设计RESTful接口
3. 实现JWT认证
4. API文档生成

### 阶段二: 前端重构 (2-3周)
1. 搭建React + TypeScript项目
2. 实现Ant Design主题
3. 创建基础组件库
4. 实现路由和状态管理

### 阶段三: 功能迁移 (2-3周)
1. 逐个迁移页面功能
2. 保持业务逻辑一致性
3. 渐进式功能验证
4. 性能优化

### 阶段四: 测试和优化 (1周)
1. 完整功能测试
2. 性能基准测试
3. 安全漏洞检查
4. 部署和监控

## 技术选型理由

### React + TypeScript
- **Type Safety**: 编译时错误检测，减少运行时错误
- **开发体验**: 优秀的IDE支持和代码智能提示
- **生态成熟**: 丰富的第三方库和社区支持
- **维护性强**: 类型定义使代码更易维护

### Ant Design
- **企业级组件**: 丰富的组件库，满足复杂业务需求
- **一致性**: 统一的设计语言和交互模式
- **国际化**: 内置多语言支持
- **可定制性**: 支持主题定制和组件样式覆盖

### Valtio
- **轻量级**: 比Redux更轻量，学习成本低
- **TypeScript友好**: 优秀的类型支持
- **响应式**: 简洁的响应式编程模型
- **性能优化**: 精准的依赖追踪

### Vite
- **开发体验**: 极速的冷启动和热更新
- **构建性能**: 基于ESBuild的快速构建
- **开箱即用**: 内置TypeScript、CSS预处理器支持
- **插件生态**: 丰富的插件生态系统

## 性能优化策略

### 前端优化
1. **代码分割**: 按路由和组件懒加载
2. **虚拟滚动**: 大列表性能优化
3. **防抖节流**: 用户输入优化
4. **缓存策略**: API数据缓存和状态持久化

### 后端优化
1. **数据库索引**: 用户数据和网络数据索引
2. **缓存机制**: Redis缓存热点数据
3. **连接池**: 数据库连接优化
4. **API限流**: 防止API滥用

## 部署架构

### 开发环境
```
Frontend: http://localhost:5173
Backend:  http://localhost:3001
ZeroTier: http://localhost:9993
```

### 生产环境
```
Frontend: Nginx + Static Files
Backend:  Node.js Cluster + PM2
Database: File Storage (保持现状)
ZeroTier: 独立服务
```

### Docker化部署
```dockerfile
# 后端Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]

# 前端Dockerfile  
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 总结

本次重构将实现：
1. **完全解耦**: 前后端独立开发和部署
2. **现代化技术栈**: React + TypeScript + Ant Design
3. **企业级架构**: 规范的项目结构和代码组织
4. **优秀性能**: 优化的状态管理和数据交互
5. **高可维护性**: TypeScript类型安全和组件化架构
6. **强扩展性**: 模块化设计便于功能扩展

重构后的系统将具备更好的可维护性、扩展性和开发效率，为后续功能迭代奠定坚实基础。