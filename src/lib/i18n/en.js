module.exports = {
  // Navigation
  nav_home: 'Home',
  nav_users: 'Users',
  nav_networks: 'Networks',
  nav_add_network: 'Add network',
  nav_create_user: 'Create user',
  nav_login: 'Login',
  nav_logout: 'Logout',

  // Common
  btn_submit: 'Submit',
  btn_cancel: 'Cancel',
  btn_delete: 'Delete',
  btn_refresh: 'Refresh',
  btn_back: 'Back',
  btn_view: 'View',
  btn_setup: 'Setup',
  btn_members: 'Members',
  btn_create_network: 'Create Network',
  btn_sign_in: 'Sign In',
  btn_sign_out: 'Sign Out',
  btn_set_password: 'Set password',

  // Login page
  login_welcome_back: 'Welcome Back',
  login_sign_in_to_manage: 'Sign in to manage your networks',
  login_username: 'Username',
  login_enter_username: 'Enter your username',
  login_password: 'Password',
  login_enter_password: 'Enter your password',
  login_remember_me: 'Remember me',
  login_forgot_password: 'Forgot password?',
  login_cancel: 'Cancel',
  login_back_to_home: '← Back to home',
  login_need_help: 'Need help?',

  // Home page
  home_network_controller: 'Network Controller',
  home_minimalist_approach: 'A minimalist approach to network management',
  home_controller_info: 'Controller Information',
  home_zerotier_address: 'ZeroTier Address',
  home_version: 'Version',
  home_status: 'Status',
  home_status_active: 'Active',
  home_networks: 'Networks',
  home_quick_actions: 'Quick Actions',
  home_view_networks: 'View Networks',
  home_create_network: 'Create Network',
  home_manage_users: 'Manage Users',
  home_system_overview: 'System Overview',
  home_controller: 'Controller',
  home_controller_online: 'Online and operational',
  home_networks_configured: 'configured',
  home_users_managed: 'System access managed',
  home_settings_complete: 'Configuration complete',
  home_recent_activity: 'Recent Activity',
  home_clean_start: 'Clean Start',
  home_clean_start_desc: 'Your network controller is running smoothly. No recent activity to display.',
  home_get_started: 'Get Started',

  // Networks page
  networks_title: 'Networks',
  networks_manage: 'Manage your ZeroTier networks',
  networks_create_network: 'Create Network',
  networks_no_networks: 'No Networks Yet',
  networks_create_first: 'Create your first ZeroTier network to get started.',
  networks_create_first_btn: 'Create Your First Network',

  // Network card
  network_status_active: 'Active',
  network_view: 'View',
  network_setup: 'Setup',
  network_delete: 'Delete',

  // Network detail
  network_detail_title: 'Network',
  network_detail_for: 'Network',
  network_members: 'Members',
  network_members_count: 'Members ({count})',
  network_member_name: 'Member name',
  network_member_id: 'Member ID',
  network_authorized: 'Authorized',
  network_active_bridge: 'Active bridge',
  network_ip_assignment: 'IP assignment',
  network_peer_status: 'Peer status',
  network_peer_address_latency: 'Peer address / latency',
  network_no_members: 'There are no members on this network - invite users to join {nwid}',
  network_detail: 'Detail for network',
  network_networks: 'Networks',

  // Network status
  network_online: 'ONLINE',
  network_relay: 'RELAY',
  network_controller: 'CONTROLLER',
  network_offline: 'OFFLINE',
  network_latency_ms: 'ms',

  // Easy setup
  easy_setup: 'Easy setup',
  easy_help: 'Help',
  easy_help_content: 'Please note that this utility only supports IPv4 at this stage.',
  easy_help_content2: 'Use the following button to automatically generate a random network address, otherwise fill in the network address CIDR manually and the IP assignment pool will be automatically calculated for you.  You can manually alter these calculated values.',
  easy_generate_address: 'Generate network address',
  easy_network_cidr: 'Network address in CIDR notation',
  easy_network_cidr_placeholder: 'e.g. 10.11.12.0/24',
  easy_pool_start: 'Start of IP assignment pool',
  easy_pool_start_placeholder: 'e.g. 10.11.12.1',
  easy_pool_end: 'End of IP assignment pool',
  easy_pool_end_placeholder: 'e.g. 10.11.12.254',
  easy_invalid_cidr: 'Invalid network CIDR',

  // Routes
  routes_title: 'Routes',
  routes_target: 'Target',
  routes_gateway: 'Gateway',
  routes_add_new: 'Add new route:',
  routes_target_label: 'Target:',
  routes_target_placeholder: 'e.g. 10.11.12.0/24',
  routes_gateway_label: 'Gateway:',
  routes_gateway_placeholder: 'e.g. 172.16.2.1 or leave blank if the target is the ZT network',

  // IP Assignments
  ip_assignments_title: 'IP Assignments',
  ip_assignments_member_name: 'Member name:',
  ip_assignments_zerotier_address: 'ZeroTier address:',
  ip_assignments_ip_address: 'IP address',
  ip_assignments_managed_routes: 'Managed routes',

  // IP Assignment Pools
  ip_pools_title: 'IP Assignment Pools',
  ip_pools_ip_range_start: 'IP range start',
  ip_pools_ip_range_end: 'IP range end',
  ip_pools_add_new: 'Add new IP Assignment Pool:',
  ip_pools_start_label: 'IP range start:',
  ip_pools_start_placeholder: 'IP range start',
  ip_pools_end_label: 'IP range end:',
  ip_pools_end_placeholder: 'IP range end',

  // v4 Assign Mode
  v4_assign_mode: 'IPv4 Assign Mode',
  v4_auto_assign: 'Auto-assign from IP Assignment Pool',

  // v6 Assign Mode
  v6_assign_mode: 'IPv6 Assign Mode',
  v6_6plane: 'ZT 6plane (/80 routable for each device)',
  v6_rfc4193: 'ZT rfc4193 (/128 for each device)',
  v6_auto_assign: 'Auto-assign from IP Assignment Pool',

  // DNS
  dns_title: 'DNS',
  dns_no_config: 'No DNS configuration on this network.',
  dns_domain: 'Domain:',
  dns_servers: 'Servers:',
  dns_servers_placeholder: '(one IP address per line)',
  dns_change_config: 'Change DNS configuration:',

  // Private
  private_title: 'Private',
  private_enable_access: 'Enable access control.',
  private_warning: 'Warning: if you disable this, you will not be able to de-authorize members of the network.  Disable this only if you know what you are doing.',

  // Network delete
  network_delete_title: 'Delete Network',
  network_deleted: '{name} ({nwid}) was deleted',
  network_delete_warning: 'Warning! Deleting a network cannot be undone',
  network_delete_button: 'Delete {name} ({nwid})',

  // Member detail
  member_detail_for: 'for member {name} ({address}) in network',

  // Member delete
  member_deleted: '{name} ({id}) was deleted',
  member_members: 'Members',
  member_delete_info: 'To undo a member deletion, just get the member to join the network again.',
  member_delete_info2: 'After deleting a member, you may see them appear in the list of members again.  This is a ZeroTier issue.  Just get the user to leave the network.',
  member_delete_button: 'Delete {name} ({id})',

  // Users page
  users_title: 'Users',
  users_no_users: 'There are no users on this system',
  users_set_password: 'set password',

  // Password page
  password_title: 'Set Password',
  password_username: 'Username:',
  password_enter_username: 'Enter username',
  password_new: 'Enter new password:',
  password_re_enter: 'Re-enter password:',
  password_change_next_login: 'Change password on next login:',

  // User delete
  user_delete_no_user: 'No such user',
  user_delete_self: 'You may not delete yourself',
  user_deleted: '{name} was deleted',
  user_delete_warning: 'Warning! Deleting a user cannot be undone',
  user_delete_button: 'Delete {name}',

  // Not implemented
  not_implemented_title: 'Not Implemented',
  not_implemented_editing: 'Editing of',
  not_implemented_note: 'has not been implemented.',
  not_implemented_note2: 'Note that you may be able to edit some properties on the',
  not_implemented_members_page: 'Members',

  // Front door
  front_door_title: 'ZeroTier',
  front_door_subtitle: 'network controller UI',

  // Error page
  error_title: 'Error',

  // Network create
  network_create_name: 'Network name:',
  network_create_name_placeholder: 'Enter new network name',

  // Network private/public
  network_private: 'Private',
  network_public: 'Public',

  // Language
  language_english: 'English',
  language_chinese: '中文',
  language_switch: 'Language'
};
