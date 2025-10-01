/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
  code: string
  message: string
  data?: T
  timestamp?: number
}

/**
 * 业务错误响应
 */
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp?: number
}
