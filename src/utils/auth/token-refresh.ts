// src/utils/auth/token-refresh.ts
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { setCsrfToken } from "./csrf"
import { getRefreshToken, setTokens } from "./token-storage"

// 刷新状态
let isRefreshing = false
let refreshSubscribers: {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void
  reject: (reason?: any) => void
  config: InternalAxiosRequestConfig
}[] = []

const MAX_REFRESH_ATTEMPTS = 3
let refreshAttempts = 0

/**
 * 将请求加入刷新队列
 */
export const enqueueRequest = (config: InternalAxiosRequestConfig) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject, config })
  })
}

/**
 * 处理队列中的请求
 */
export const processQueue = async (
  service: AxiosInstance,
  error: Error | null,
  newToken?: string
) => {
  // 创建副本，避免在迭代中修改原数组
  const subscribers = [...refreshSubscribers]
  refreshSubscribers = []

  for (const promise of subscribers) {
    try {
      if (error) {
        promise.reject(error)
      } else {
        // 更新 Token
        if (newToken) {
          promise.config.headers.set("Authorization", `Bearer ${newToken}`)
        }

        // 标记为已重试
        promise.config._retry = true

        // 重试请求
        const response = await service(promise.config)
        promise.resolve(response)
      }
    } catch (err) {
      promise.reject(err)
    }
  }
}

/**
 * 刷新访问 Token
 */
export const refreshAccessToken = async (
  service: AxiosInstance
): Promise<string> => {
  try {
    // 1. 获取新的 CSRF Token
    const csrfResponse = await service.get("/api/auth/csrf-token", {
      skipAuth: true,
    })

    // 安全设置 CSRF Token
    if (csrfResponse.data?.csrfToken) {
      setCsrfToken(csrfResponse.data.csrfToken)
    }

    // 2. 刷新 Token
    const refreshResponse = await service.post(
      "/api/auth/refresh",
      {
        refreshToken: getRefreshToken(),
      },
      {
        skipAuth: true,
      }
    )

    // 3. 设置新 Token
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      refreshResponse.data
    setTokens(newAccessToken, newRefreshToken)

    return newAccessToken
  } catch (error) {
    // 处理刷新失败
    throw new Error("Token refresh failed")
  }
}

/**
 * 获取刷新状态
 */
export const getRefreshState = () => ({
  isRefreshing,
  refreshAttempts,
  MAX_REFRESH_ATTEMPTS,
})

/**
 * 重置刷新状态
 */
export const resetRefreshState = () => {
  isRefreshing = false
  refreshAttempts = 0
  refreshSubscribers = []
}

/**
 * 增加刷新尝试次数
 */
export const incrementRefreshAttempts = () => {
  refreshAttempts++
}

/**
 * 指数退避延迟
 */
export const getRefreshDelay = (): number => {
  return Math.min(1000 * 2 ** refreshAttempts, 30000)
}
