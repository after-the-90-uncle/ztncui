# UI 风格迁移至 Ant Design

## 概述
此文档记录了将 ZTNCUI 项目从 Bootstrap 3 迁移至 Ant Design 的所有更改。

## 更改内容

### 1. 依赖包更新 (`package.json`)
- ❌ 移除：`bootstrap`, `jquery`（Bootstrap 3 依赖）
- ✅ 添加：`antd` (v5.12.0) - Ant Design 库

### 2. 应用配置 (`app.js`)
- 移除 Bootstrap 的静态资源路由
  - `/fonts` - Bootstrap 字体
  - `/bscss` - Bootstrap CSS
  - `/jqjs` - jQuery
  - `/bsjs` - Bootstrap JavaScript
- 添加 Ant Design 静态资源路由：`/antd` - Ant Design CSS 和 JavaScript

### 3. 样式文件

#### `public/stylesheets/style.css`
- 移除所有 Bootstrap 3 相关样式
- 保留文件用于向后兼容

#### `public/stylesheets/antd-custom.css` (新文件)
- 自定义 Ant Design 主题颜色和样式
- 包括布局、按钮、表单、表格等组件的定制
- 采用现代化的紫色渐变导航栏设计

### 4. 视图模板更新 (`src/views/*.pug`)

#### 核心布局模板
- **head_layout.pug**: 
  - 从 Bootstrap navbar 改为 Ant Design Layout + Sider 侧边栏
  - 新增渐变紫色侧导航栏设计
  - 更新 CDN 链接为 Ant Design

- **controller_layout.pug**: 
  - 采用 Ant Design 菜单组件
  - 添加 emoji 图标使菜单更直观

- **login_layout.pug**: 
  - 采用 Ant Design Card 组件
  - 创建居中的登录卡片界面

- **users_layout.pug**: 
  - 采用 Ant Design 菜单和布局

- **network_layout.pug**: 
  - 采用 Ant Design Row/Col 网格系统
  - 美化网络信息显示

#### 页面模板
- **login.pug**: 
  - 采用 Ant Design Form 表单
  - Alert 组件处理错误信息

- **networks.pug**: 
  - 采用 Ant Design Table 组件
  - 更好的数据展示体验

- **users.pug**: 
  - Ant Design Table 展示用户列表
  - Button 组件替代链接

- **password.pug**: 
  - Ant Design Form 表单
  - Checkbox 组件

- **routes.pug**: 
  - Ant Design Table 展示路由
  - Card 分页显示

- **ipAssignmentPools.pug**: 
  - Ant Design Table 展示 IP 池
  - Card 组织表单

- **dns.pug**: 
  - Ant Design Descriptions 展示现有配置
  - Form 编辑 DNS 设置

- **v4AssignMode.pug** / **v6AssignMode.pug**: 
  - Ant Design Checkbox 组件
  - 简洁的设置界面

- **network_easy.pug**: 
  - Ant Design Form 和 Collapse
  - 改进的交互体验

- **private.pug**: 
  - Ant Design Checkbox 设置

- **ipAssignments.pug**: 
  - Ant Design Table 多表展示
  - Descriptions 展示成员信息

- **member_detail.pug**: 
  - Ant Design Descriptions 展示成员详情

- **network_delete.pug** / **member_delete.pug** / **user_delete.pug**: 
  - Ant Design Alert 警告框
  - 更清晰的删除确认界面

- **front_door.pug**: 
  - 美化的欢迎页面

- **error.pug**: 
  - Ant Design Alert 显示错误
  - 改进的错误信息展示

- **not_implemented.pug**: 
  - Ant Design Alert 和 Descriptions

- **index.pug**: 
  - 更新为 Ant Design 样式

## 设计特色

### 配色方案
- 主色调：蓝色 (`#1890ff`)
- 导航栏：紫色渐变 (`#667eea` 到 `#764ba2`)
- 背景色：浅灰色 (`#f0f2f5`)

### 组件使用
- Layout: 页面布局框架
- Sider: 侧边导航栏
- Menu: 导航菜单
- Table: 数据表格
- Form: 表单输入
- Card: 内容卡片
- Alert: 消息提示
- Button: 操作按钮
- Descriptions: 信息展示
- Checkbox: 复选框
- Collapse: 可折叠内容

## 安装和使用

1. 安装依赖：
```bash
cd src
npm install
```

2. 启动应用：
```bash
npm start
```

或开发模式：
```bash
npm run devstart
```

## 兼容性说明

- 需要现代浏览器支持 CSS Grid 和 Flexbox
- 推荐使用最新版本的 Chrome、Firefox、Safari 或 Edge

## 未来改进

- [ ] 考虑集成 Ant Design 的 JavaScript 功能
- [ ] 添加响应式设计支持
- [ ] 考虑暗色主题支持
- [ ] 优化移动端展示

## 参考资源

- Ant Design 官网: https://ant.design/
- Ant Design 文档: https://ant.design/docs/react/introduce
