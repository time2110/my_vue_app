// src/utils/request/errors/utils.ts
import { getSafeConfig } from "@/utils/request/core"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"
import type { ErrorContext } from "./types"

/**
 * 安全获取错误代码
 */
export const getErrorCode = (error: AxiosError): string | null => {
  if (!error.response) return null

  const data = error.response.data

  // 尝试从标准结构获取
  if (data && typeof data === "object") {
    if ("code" in data && typeof (data as any).code === "string") {
      return (data as any).code
    }

    // 尝试从嵌套结构获取
    if (
      "error" in data &&
      (data as any).error &&
      "code" in (data as any).error &&
      typeof (data as any).error.code === "string"
    ) {
      return (data as any).error.code
    }
  }

  return null
}

/**
 * 创建错误上下文
 */
export const createErrorContext = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
): ErrorContext => {
  const safeConfig = getSafeConfig(config)
  const url = safeConfig.url || "/unknown"
  const method = safeConfig.method?.toUpperCase() || "UNKNOWN"

  return {
    url,
    method,
    status: error.response?.status,
    errorCode: getErrorCode(error),
  }
}

/**
 * 增强错误对象
 */
export const enhanceError = (error: AxiosError, context: ErrorContext) => {
  return {
    ...error,
    context,
    timestamp: Date.now(),
  }
}
