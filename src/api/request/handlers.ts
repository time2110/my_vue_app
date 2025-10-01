// src/utils/request/errors/handlers.ts
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

/**
 * 网络错误处理（生产环境脱敏版本）
 */
export const handleNetworkError = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  // 检查是否存在响应
  if (error.response) {
    // 请求已发出，但服务器响应了错误状态码
    // 生产环境中只记录必要的错误信息，避免敏感数据泄露
    console.error("Network Error Response:", {
      status: error.response.status,
      url: config.url ? config.url.split("?")[0] : undefined, // 移除查询参数避免敏感信息泄露
    })

    // 可以根据不同的状态码进行不同的处理
    switch (error.response.status) {
      case 401:
        // 未授权，可能需要重新登录
        console.warn("Unauthorized access - redirect to login")
        // 401 未认证处理（核心：Token 刷新机制）

        break
      case 403:
        // 禁止访问
        console.warn("Access forbidden")
        break
      case 500:
        // 服务器内部错误（生产环境不显示具体错误详情）
        console.error("Internal server error occurred")
        break
      default:
        console.error(`Request failed with status ${error.response.status}`)
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    // 生产环境中不记录请求详情，避免敏感信息泄露
    console.error("No response received from server", {
      url: config.url ? config.url.split("?")[0] : undefined, // 移除查询参数
    })
  } else {
    // 在设置请求时发生了一些事情，触发了一个错误
    // 生产环境中不显示具体错误消息内容
    console.error("Error occurred while setting up request")
  }

  // 返回原始错误，但不包含敏感信息
  // 创建一个新的错误对象，避免传递敏感数据
  const safeError = new Error(
    `Request failed with status ${error.response?.status || "unknown"}`
  )
  safeError.name = "NetworkError"

  return Promise.reject(safeError)
}

/**
 * 客户端错误处理 (4xx)
 */
export const handleClientError = async (
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  // 检查是否存在响应
  if (error.response) {
    const { status, statusText } = error.response

    // 记录客户端错误日志
    console.warn("Client Error (4xx):", {
      status,
      statusText,
      url: config.url,
      method: config.method?.toUpperCase(),
      // 在生产环境中避免记录详细的数据内容
      ...(import.meta.env.DEV && { data: config.data }),
    })
    console.log(import.meta.env.DEV, error.response)

    switch (status) {
      case 400:
        // 错误请求，可能是参数错误
        console.warn("Bad Request - check request parameters")
        break

      case 401:
        // 未授权，可能需要重新登录或刷新token
        console.warn("Unauthorized - authentication required")
        // 可以在这里添加重新登录或刷新token的逻辑
        break

      case 403:
        // 禁止访问，用户没有权限
        console.warn("Forbidden - access denied")
        break

      case 404:
        // 资源未找到
        console.warn("Resource not found")
        break

      case 422:
        // 请求格式正确，但语义错误（如表单验证失败）
        console.warn("Unprocessable Entity - validation error")
        break

      case 429:
        // 请求过于频繁
        console.warn("Too Many Requests - rate limit exceeded")
        // 可以在这里实现重试逻辑
        break

      default:
        // 其他4xx错误
        console.warn(`Client error ${status}: ${statusText}`)
    }
  }

  // 返回错误，让调用者进一步处理
  return Promise.reject(error)
}

/**
 * 服务器错误处理 (5xx)
 */
export const handleServerError = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  // 检查是否存在响应
  if (error.response) {
    const { status, statusText } = error.response

    // 记录服务器错误日志（生产环境脱敏）
    console.error("Server Error (5xx):", {
      status,
      statusText,
      url: config.url ? config.url.split("?")[0] : undefined, // 移除查询参数
      method: config.method?.toUpperCase(),
      // 生产环境中不记录详细错误数据
      ...(import.meta.env.DEV && { data: error.response.data }),
    })

    switch (status) {
      case 500:
        // 服务器内部错误
        console.error("Internal Server Error - please contact administrator")
        break

      case 502:
        // 错误网关
        console.error("Bad Gateway - server is temporarily unavailable")
        break

      case 503:
        // 服务不可用
        console.error("Service Unavailable - server is temporarily offline")
        break

      case 504:
        // 网关超时
        console.error("Gateway Timeout - server response timeout")
        break

      default:
        // 其他5xx错误
        console.error(`Server error ${status}: ${statusText}`)
    }
  } else if (error.request) {
    // 请求发送但无响应
    console.error("No response from server:", {
      url: config.url ? config.url.split("?")[0] : undefined,
    })
  }

  // 创建安全的错误对象返回
  const safeError = new Error(
    `Server error occurred${
      error.response?.status ? ` (${error.response.status})` : ""
    }`
  )
  safeError.name = "ServerError"

  return Promise.reject(safeError)
}
