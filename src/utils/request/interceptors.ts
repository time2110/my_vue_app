// src/utils/request/interceptors.ts
import { ENV } from "@/constants/env"
import { getCsrfToken } from "@/utils/auth/csrf"
import { getAccessToken } from "@/utils/auth/token-storage"
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { getSafeConfig } from "./core"
import {
  handleClientError,
  handleNetworkError,
  handleServerError,
} from "./errors/handlers"

/**
 * 添加请求拦截器
 */
export const setupRequestInterceptors = (service: AxiosInstance) => {
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 1. 安全获取配置
      const safeConfig = getSafeConfig(config)

      // 2. GET请求防缓存处理
      if (safeConfig.method?.toUpperCase() === "GET") {
        safeConfig.params = {
          ...safeConfig.params,
          _t: Date.now(),
        }
      }

      // 3. 生产环境防御性处理
      if (ENV.VITE_APP_ENV === "production") {
        // 防止调试参数泄露
        if (safeConfig.params) {
          ;["_debug", "mock", "inspect"].forEach((param) => {
            if (param in safeConfig.params) {
              delete safeConfig.params[param]
            }
          })
        }

        // 防止敏感数据上送
        if (safeConfig.data) {
          const sensitiveFields = ["password", "passwd", "pwd"]
          sensitiveFields.forEach((field) => {
            if (safeConfig.data[field]) {
              console.error(`[Security] Sensitive field detected: ${field}`)
              safeConfig.data[field] = "******"
            }
          })
        }
      }

      // 4. ✅ 添加 Bearer Token（使用 set 方法）
      const accessToken = getAccessToken()
      if (accessToken && !safeConfig.skipAuth) {
        safeConfig.headers.set("Authorization", `Bearer ${accessToken}`)
      }

      // 5. ✅ 注入CSRF Token（使用 set 方法）
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
      const safeConfig = getSafeConfig(config)

      // 2. 网络错误处理（无响应）
      if (!error.response) {
        return handleNetworkError(error, safeConfig)
      }

      const status = error.response.status

      // 3. 客户端错误处理 (4xx)
      if (status >= 400 && status < 500) {
        return handleClientError(service, error, safeConfig)
      }

      // 4. 服务器错误处理 (5xx)
      if (status >= 500) {
        return handleServerError(error, safeConfig)
      }

      return Promise.reject(error)
    }
  )
}
