// API 相关类型定义

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  passSet: boolean;
  createdAt?: string;
  role:string
}

export interface Network {
  id: string;
  name: string;
  nwid: string;
  private: boolean;
  description?: string;
  ipAssignmentPools: IPAssignmentPool[];
  routes: NetworkRoute[];
  dns?: DNSServer;
  v4AssignMode: string;
  v6AssignMode: string;
  creationTime?: string;
  memberRevision?: number;
}

export interface IPAssignmentPool {
  ipRangeStart: string;
  ipRangeEnd: string;
}

export interface NetworkRoute {
  target: string;
  via?: string;
  flags?: string[];
}

export interface DNSServer {
  servers: string[];
}

export interface NetworkMember {
  id: string;
  address: string;
  name: string;
  authorized: boolean;
  ipAssignments: string[];
  lastSeen?: string;
  creationTime?: string;
  online?: boolean;
  peer?: PeerInfo;
}

export interface PeerInfo {
  address: string;
  lastOnline: string;
  latency: number;
  role: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface NetworkCreateRequest {
  name: string;
}

export interface NetworkUpdateRequest {
  name?: string;
  private?: boolean;
  v4AssignMode?: string;
  v6AssignMode?: string;
  ipAssignmentPools?: IPAssignmentPool[];
  routes?: NetworkRoute[];
  dns?: DNSServer;
}

export interface IPAssignmentPoolRequest {
  ipRangeStart: string;
  ipRangeEnd: string;
}

export interface RouteRequest {
  target: string;
  via?: string;
  flags?: string[];
}

export interface DNSRequest {
  servers: string[];
}

export interface MemberAuthorizationRequest {
  authorized: boolean;
}

export interface MemberUpdateRequest {
  authorized?: boolean;
  name?: string;
}

export interface IPAssignmentRequest {
  ipAddress: string;
}