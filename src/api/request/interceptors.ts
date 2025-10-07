// src/utils/request/interceptors.ts
import { getCsrfToken } from "@/utils/auth/csrf"
import { getAccessToken } from "@/utils/auth/token-storage"
import {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"
import {
  handleClientError,
  handleNetworkError,
  handleServerError,
} from "./handlers"

/**
 * 添加请求拦截器
 */
export const setupRequestInterceptors = (service: AxiosInstance) => {
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.log("Request Config:", config)

      // 1. 安全获取配置
      const safeConfig = getSafeConfig(config) as InternalAxiosRequestConfig

      // 2. GET请求防缓存处理
      if (safeConfig.method?.toUpperCase() === "GET") {
        safeConfig.params = {
          ...safeConfig.params,
          _t: Date.now(),
        }
      }

      // 3. ✅ 添加 Bearer Token（使用 set 方法）
      const accessToken = getAccessToken()
      if (accessToken && !safeConfig.skipAuth) {
        safeConfig.headers.set("Authorization", `Bearer ${accessToken}`)
      }

      // 4. ✅ 注入CSRF Token（使用 set 方法）
      if (
        !["GET", "HEAD", "OPTIONS"].includes(
          safeConfig.method?.toUpperCase() || ""
        )
      ) {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
          safeConfig.headers.set("X-CSRF-TOKEN", csrfToken)
        }
      }

      return safeConfig
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

/**
 * 添加响应拦截器
 */
export const setupResponseInterceptors = (service: AxiosInstance) => {
  service.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      // 1. 安全获取配置
      let config = error.config as InternalAxiosRequestConfig | undefined
      const safeConfig = getSafeConfig(config) as InternalAxiosRequestConfig

      // 2. 网络错误处理（无响应）
      if (!error.response) {
        return handleNetworkError(error, safeConfig)
      }

      const status = error.response.status

      // 3. 客户端错误处理 (4xx)
      if (status >= 400 && status < 500) {
        return handleClientError(error, safeConfig)
      }

      // 4. 服务器错误处理 (5xx)
      if (status >= 500) {
        return handleServerError(error, safeConfig)
      }

      return Promise.reject(error)
    }
  )
}

/**
 * 安全获取请求配置（在 Axios 的不同版本中，headers 的内部实现可能发生变化）
 */

export function getSafeConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config) {
    return { headers: new AxiosHeaders() }
  }

  const { headers } = config

  // 检查 headers 是否已经是 AxiosHeaders 实例
  if (headers instanceof AxiosHeaders) {
    return config
  }

  // 如果不是，创建新的 AxiosHeaders 实例并转换（兼容处理 headers 类型 ）
  const normalizedHeaders = new AxiosHeaders()
  if (headers && typeof headers === "object") {
    // 遍历headers对象的键值对，将每个键值对添加到normalizedHeaders中
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        normalizedHeaders.set(key, String(value))
      }
    })
  }

  return {
    ...config,
    headers: normalizedHeaders,
  }
}
