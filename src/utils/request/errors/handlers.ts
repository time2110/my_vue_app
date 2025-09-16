// src/utils/request/errors/handlers.ts
import { ENV } from "@/constants/env"
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios"
import { handleForbidden, handleUnauthorized } from "../auth/handle-401"
import { createErrorContext, enhanceError } from "./utils"

/**
 * 网络错误处理
 */
export const handleNetworkError = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  const context = createErrorContext(error, config)

  console.error(`[Network] Request failed to ${context.url}:`, error.message)

  // 生产环境脱敏
  if (ENV.VITE_APP_ENV === "production") {
    return Promise.reject(
      enhanceError(error, {
        ...context,
        errorCode: "NETWORK_ERROR",
      })
    )
  }

  return Promise.reject(enhanceError(error, context))
}

/**
 * 客户端错误处理 (4xx)
 */
export const handleClientError = async (
  service: AxiosInstance,
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  const context = createErrorContext(error, config)

  // 4.1 401 未认证处理
  if (context.status === 401 || context.errorCode === "TOKEN_EXPIRED") {
    return handleUnauthorized(service, error, config)
  }

  // 4.2 403 禁止访问处理
  if (context.status === 403 || context.errorCode === "PERMISSION_DENIED") {
    return handleForbidden(error, config, {
      code: context.errorCode || "FORBIDDEN",
      message: "Forbidden",
    })
  }

  // 4.3 其他业务错误
  if (ENV.VITE_APP_ENV === "production") {
    console.error(
      `[API Error] Client error ${context.status} at ${context.url}:`,
      context.errorCode || "Unknown error"
    )
    return Promise.reject(
      enhanceError(error, {
        ...context,
        message: "请求异常",
      })
    )
  }

  console.error(
    `[API Error] Client error ${context.status} at ${context.url}:\n` +
      `Code: ${context.errorCode || "N/A"}`
  )

  return Promise.reject(enhanceError(error, context))
}

/**
 * 服务器错误处理 (5xx)
 */
export const handleServerError = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
) => {
  const context = createErrorContext(error, config)

  if (ENV.VITE_APP_ENV === "production") {
    console.error(
      `[API Error] Server error ${context.status} at ${context.url}`
    )
    return Promise.reject(
      enhanceError(error, {
        ...context,
        message: "服务暂时不可用，请稍后再试",
      })
    )
  }

  console.error(
    `[API Error] Server error ${context.status} at ${context.url}:`,
    error.response?.data || "No response data"
  )

  return Promise.reject(enhanceError(error, context))
}
