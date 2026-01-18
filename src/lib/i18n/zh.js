module.exports = {
  // Navigation
  nav_home: '首页',
  nav_users: '用户',
  nav_networks: '网络',
  nav_add_network: '添加网络',
  nav_create_user: '创建用户',
  nav_login: '登录',
  nav_logout: '退出',

  // Common
  btn_submit: '提交',
  btn_cancel: '取消',
  btn_delete: '删除',
  btn_refresh: '刷新',
  btn_back: '返回',
  btn_view: '查看',
  btn_setup: '设置',
  btn_members: '成员',
  btn_create_network: '创建网络',
  btn_sign_in: '登录',
  btn_sign_out: '退出',
  btn_set_password: '设置密码',

  // Login page
  login_welcome_back: '欢迎回来',
  login_sign_in_to_manage: '登录以管理您的网络',
  login_username: '用户名',
  login_enter_username: '请输入用户名',
  login_password: '密码',
  login_enter_password: '请输入密码',
  login_remember_me: '记住我',
  login_forgot_password: '忘记密码？',
  login_cancel: '取消',
  login_back_to_home: '← 返回首页',
  login_need_help: '需要帮助？',

  // Home page
  home_network_controller: '网络控制器',
  home_minimalist_approach: '简约的网络管理方式',
  home_controller_info: '控制器信息',
  home_zerotier_address: 'ZeroTier 地址',
  home_version: '版本',
  home_status: '状态',
  home_status_active: '在线',
  home_networks: '网络',
  home_quick_actions: '快捷操作',
  home_view_networks: '查看网络',
  home_create_network: '创建网络',
  home_manage_users: '管理用户',
  home_system_overview: '系统概览',
  home_controller: '控制器',
  home_controller_online: '在线并正常运行',
  home_networks_configured: '已配置',
  home_users_managed: '系统访问已管理',
  home_settings_complete: '配置完成',
  home_recent_activity: '最近活动',
  home_clean_start: '全新开始',
  home_clean_start_desc: '您的网络控制器运行正常。没有最近的活动要显示。',
  home_get_started: '开始使用',

  // Networks page
  networks_title: '网络',
  networks_manage: '管理您的 ZeroTier 网络',
  networks_create_network: '创建网络',
  networks_no_networks: '暂无网络',
  networks_create_first: '创建您的第一个 ZeroTier 网络以开始使用。',
  networks_create_first_btn: '创建您的第一个网络',

  // Network card
  network_status_active: '在线',
  network_view: '查看',
  network_setup: '设置',
  network_delete: '删除',

  // Network detail
  network_detail_title: '网络',
  network_detail_for: '网络',
  network_members: '成员',
  network_members_count: '成员 ({count})',
  network_member_name: '成员名称',
  network_member_id: '成员 ID',
  network_authorized: '已授权',
  network_active_bridge: '活跃桥接',
  network_ip_assignment: 'IP 分配',
  network_peer_status: '对等状态',
  network_peer_address_latency: '对等地址 / 延迟',
  network_no_members: '此网络上没有成员 - 邀请用户加入 {nwid}',
  network_detail: '网络详情',
  network_networks: '网络列表',

  // Network status
  network_online: '在线',
  network_relay: '中继',
  network_controller: '控制器',
  network_offline: '离线',
  network_latency_ms: '毫秒',

  // Easy setup
  easy_setup: '简易设置',
  easy_help: '帮助',
  easy_help_content: '请注意，此工具目前仅支持 IPv4。',
  easy_help_content2: '使用以下按钮自动生成随机网络地址，或手动填写网络地址 CIDR，IP 分配池将自动为您计算。您可以手动更改这些计算值。',
  easy_generate_address: '生成网络地址',
  easy_network_cidr: 'CIDR 格式的网络地址',
  easy_network_cidr_placeholder: '例如：10.11.12.0/24',
  easy_pool_start: 'IP 分配池起始地址',
  easy_pool_start_placeholder: '例如：10.11.12.1',
  easy_pool_end: 'IP 分配池结束地址',
  easy_pool_end_placeholder: '例如：10.11.12.254',
  easy_invalid_cidr: '无效的网络 CIDR',

  // Routes
  routes_title: '路由',
  routes_target: '目标',
  routes_gateway: '网关',
  routes_add_new: '添加新路由：',
  routes_target_label: '目标：',
  routes_target_placeholder: '例如：10.11.12.0/24',
  routes_gateway_label: '网关：',
  routes_gateway_placeholder: '例如：172.16.2.1 或留空（如果目标是 ZT 网络）',

  // IP Assignments
  ip_assignments_title: 'IP 分配',
  ip_assignments_member_name: '成员名称：',
  ip_assignments_zerotier_address: 'ZeroTier 地址：',
  ip_assignments_ip_address: 'IP 地址',
  ip_assignments_managed_routes: '托管路由',

  // IP Assignment Pools
  ip_pools_title: 'IP 分配池',
  ip_pools_ip_range_start: 'IP 范围起始',
  ip_pools_ip_range_end: 'IP 范围结束',
  ip_pools_add_new: '添加新的 IP 分配池：',
  ip_pools_start_label: 'IP 范围起始：',
  ip_pools_start_placeholder: 'IP 范围起始',
  ip_pools_end_label: 'IP 范围结束：',
  ip_pools_end_placeholder: 'IP 范围结束',

  // v4 Assign Mode
  v4_assign_mode: 'IPv4 分配模式',
  v4_auto_assign: '从 IP 分配池自动分配',

  // v6 Assign Mode
  v6_assign_mode: 'IPv6 分配模式',
  v6_6plane: 'ZT 6plane（每个设备 /80 可路由）',
  v6_rfc4193: 'ZT rfc4193（每个设备 /128）',
  v6_auto_assign: '从 IP 分配池自动分配',

  // DNS
  dns_title: 'DNS',
  dns_no_config: '此网络上没有 DNS 配置。',
  dns_domain: '域名：',
  dns_servers: '服务器：',
  dns_servers_placeholder: '（每行一个 IP 地址）',
  dns_change_config: '更改 DNS 配置：',

  // Private
  private_title: '私有',
  private_enable_access: '启用访问控制。',
  private_warning: '警告：如果禁用此选项，您将无法取消授权网络成员。仅在您知道自己在做什么的情况下才禁用此选项。',

  // Network delete
  network_delete_title: '删除网络',
  network_deleted: '{name} ({nwid}) 已被删除',
  network_delete_warning: '警告！删除网络无法撤销',
  network_delete_button: '删除 {name} ({nwid})',

  // Member detail
  member_detail_for: '网络中的成员 {name} ({address})',

  // Member delete
  member_deleted: '{name} ({id}) 已被删除',
  member_members: '成员列表',
  member_delete_info: '要撤销成员删除，只需让该成员重新加入网络。',
  member_delete_info2: '删除成员后，您可能会看到他们再次出现在成员列表中。这是 ZeroTier 的问题。让用户离开网络即可。',
  member_delete_button: '删除 {name} ({id})',

  // Users page
  users_title: '用户',
  users_no_users: '此系统没有用户',
  users_set_password: '设置密码',

  // Password page
  password_title: '设置密码',
  password_username: '用户名：',
  password_enter_username: '请输入用户名',
  password_new: '请输入新密码：',
  password_re_enter: '请再次输入密码：',
  password_change_next: '下次登录时更改密码：',

  // User delete
  user_delete_no_user: '用户不存在',
  user_delete_self: '您不能删除自己',
  user_deleted: '{name} 已被删除',
  user_delete_warning: '警告！删除用户无法撤销',
  user_delete_button: '删除 {name}',

  // Not implemented
  not_implemented_title: '未实现',
  not_implemented_editing: '编辑',
  not_implemented_note: '尚未实现。',
  not_implemented_note2: '注意您可能可以在',
  not_implemented_members_page: '成员',

  // Front door
  front_door_title: 'ZeroTier',
  front_door_subtitle: '网络控制器 UI',

  // Error page
  error_title: '错误',

  // Network create
  network_create_name: '网络名称：',
  network_create_name_placeholder: '请输入新网络名称',

  // Network private/public
  network_private: '私有',
  network_public: '公开',

  // Language
  language_english: 'English',
  language_chinese: '中文',
  language_switch: '语言'
};
