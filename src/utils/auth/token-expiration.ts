// src/utils/auth/token-expiration.ts
import { getAccessToken, isTokenValid } from "./token-storage"

/**
 * 启动 Token 过期检查
 */
export const startTokenExpirationCheck = () => {
  if (typeof window === "undefined") return

  // 清除现有检查
  if ((window as any).__tokenCheckInterval) {
    clearInterval((window as any).__tokenCheckInterval)
  }

  // 每 30 秒检查一次
  ;(window as any).__tokenCheckInterval = setInterval(() => {
    // 检查 Token 是否存在且即将过期
    if (getAccessToken() && !isTokenValid()) {
      console.debug("[Auth] Token已过期")
      // 触发刷新（通过事件）
      window.dispatchEvent(new Event("token:expired"))
    }
  }, 30000)
}
