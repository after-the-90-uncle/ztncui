import { message } from 'antd';

// 错误类型定义
export interface ApiError {
  code?: string;
  message: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// 错误处理工具类
export class ErrorHandler {
  // 处理API错误
  static handleApiError(error: any): ApiError {
    if (error.response) {
      // 服务器响应错误
      const { status, data } = error.response;
      return {
        code: data?.error?.code || 'API_ERROR',
        message: data?.error?.message || data?.message || `请求失败 (${status})`,
        status,
        details: data
      };
    } else if (error.request) {
      // 网络错误
      return {
        code: 'NETWORK_ERROR',
        message: '网络连接失败，请检查网络连接',
        details: error.request
      };
    } else {
      // 其他错误
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || '发生未知错误',
        details: error
      };
    }
  }

  // 显示错误消息
  static showError(error: any, customMessage?: string): ApiError {
    const apiError = this.handleApiError(error);
    const displayMessage = customMessage || apiError.message;
    
    message.error(displayMessage);
    
    // 在开发环境中记录详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', apiError);
    }
    
    return apiError;
  }

  // 显示成功消息
  static showSuccess(messageText: string): void {
    message.success(messageText);
  }

  // 显示警告消息
  static showWarning(messageText: string): void {
    message.warning(messageText);
  }

  // 显示信息消息
  static showInfo(messageText: string): void {
    message.info(messageText);
  }

  // 验证API响应
  static validateResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.error?.message || '请求失败');
    }
    return response.data as T;
  }

  // 提取错误码
  static getErrorCode(error: any): string {
    return this.handleApiError(error).code || 'UNKNOWN_ERROR';
  }

  // 检查是否为认证错误
  static isAuthError(error: any): boolean {
    const errorCode = this.getErrorCode(error);
    return errorCode === 'UNAUTHORIZED' || errorCode === 'TOKEN_EXPIRED';
  }

  // 检查是否为权限错误
  static isPermissionError(error: any): boolean {
    const errorCode = this.getErrorCode(error);
    return errorCode === 'FORBIDDEN' || errorCode === 'INSUFFICIENT_PERMISSIONS';
  }

  // 检查是否为网络错误
  static isNetworkError(error: any): boolean {
    const errorCode = this.getErrorCode(error);
    return errorCode === 'NETWORK_ERROR' || errorCode === 'CONNECTION_TIMEOUT';
  }
}

// 异步操作包装器
export async function handleAsync<T>(
  operation: () => Promise<T>,
  options?: {
    showSuccess?: string;
    showError?: boolean;
    onError?: (error: any) => void;
  }
): Promise<T | null> {
  try {
    const result = await operation();
    
    if (options?.showSuccess) {
      ErrorHandler.showSuccess(options.showSuccess);
    }
    
    return result;
  } catch (error) {
    if (options?.showError !== false) {
      ErrorHandler.showError(error);
    }
    
    if (options?.onError) {
      options.onError(error);
    }
    
    return null;
  }
}

// 表单验证辅助函数
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}是必填项`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址';
  }
  return null;
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value && value.length < minLength) {
    return `${fieldName}长度至少${minLength}个字符`;
  }
  return null;
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName}长度不能超过${maxLength}个字符`;
  }
  return null;
}