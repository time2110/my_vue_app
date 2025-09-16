// src/utils/auth/token-storage.ts
import { ENV } from "@/constants/env"

// 私有变量（无法从外部直接访问）
let _accessToken: string | null = null
let _refreshToken: string | null = null

/**
 * 安全获取访问 Token
 */
export const getAccessToken = (): string | null => {
  return _accessToken
}

/**
 * 安全获取刷新 Token
 */
export const getRefreshToken = (): string | null => {
  return _refreshToken
}

/**
 * 安全设置 Token
 */
export const setTokens = (newAccessToken: string, newRefreshToken: string) => {
  _accessToken = newAccessToken
  _refreshToken = newRefreshToken

  // 开发环境调试
  if (ENV.VITE_APP_ENV === "development") {
    console.debug("[Auth] Tokens updated")
  }
}

/**
 * 清除 Token
 */
export const clearTokens = () => {
  _accessToken = null
  _refreshToken = null

  // 清除过期间隔
  if (typeof window !== "undefined" && (window as any).__tokenCheckInterval) {
    clearInterval((window as any).__tokenCheckInterval)
    delete (window as any).__tokenCheckInterval
  }
}

/**
 * 检查 Token 是否存在
 */
export const hasValidToken = (): boolean => {
  return !!_accessToken
}

/**
 * 验证 Token 是否有效
 */
export const isTokenValid = (): boolean => {
  const token = _accessToken
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const exp = payload.exp * 1000
    return exp > Date.now()
  } catch (e) {
    return false
  }
}
