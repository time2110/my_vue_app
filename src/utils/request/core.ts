// src/utils/request/core.ts
import { ENV } from "@/constants/env"
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"

/**
 * 创建基础 Axios 实例
 */
export const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: ENV.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

/**
 * 安全获取请求配置
 */
export const getSafeConfig = (
  config?: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (config) {
    // 确保 headers 是 AxiosHeaders 类型
    if (!(config.headers instanceof AxiosHeaders)) {
      const headers = new AxiosHeaders()

      if (config.headers) {
        Object.entries(config.headers).forEach(([key, value]) => {
          headers.set(key, value as string)
        })
      }

      config.headers = headers
    }

    return config
  }

  // 创建符合 AxiosHeaders 接口的默认 headers
  const defaultHeaders = new AxiosHeaders()

  return {
    url: "/unknown",
    method: "unknown",
    headers: defaultHeaders,
    baseURL: ENV.VITE_API_BASE_URL,
  }
}
