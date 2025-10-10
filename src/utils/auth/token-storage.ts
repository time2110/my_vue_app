// src/utils/auth/token-storage.ts

export const setTokens = (token: string) => {
  localStorage.setItem("token", token)
  startTokenExpirationCheck()
}
export const getAccessToken = () => {
  return localStorage.getItem("token")
}
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
/**
 * 清除 Token
 */
export const clearTokens = () => {
  localStorage.removeItem("token")

  // 清除过期间隔
  if (typeof window !== "undefined" && (window as any).__tokenCheckInterval) {
    clearInterval((window as any).__tokenCheckInterval)
    delete (window as any).__tokenCheckInterval
  }
}

/**
 * 验证 Token 是否有效
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    console.log("token_payload", payload)
    const exp = payload.exp * 1000
    return exp > Date.now()
  } catch (e) {
    return false
  }
}
