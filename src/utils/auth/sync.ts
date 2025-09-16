// src/utils/auth/sync.ts
import { useUserStore } from "@/stores/user"

/**
 * 广播登出事件（多标签页同步）
 */
export const broadcastLogout = () => {
  if (typeof window !== "undefined") {
    // 使用 localStorage 实现跨标签页通信
    window.localStorage.setItem("auth:logout", Date.now().toString())
    window.localStorage.removeItem("auth:logout")
  }
}

/**
 * 安全登出用户
 */
export const forceLogout = () => {
  const userStore = useUserStore()

  // 1. 重置用户状态
  // userStore.reset()

  // 2. 广播登出事件
  broadcastLogout()

  // 3. 仅当不在登录页时重定向
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/login")
  ) {
    const redirect = window.location.href
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
  }
}

/**
 * 初始化认证同步
 */
export const initAuthSync = () => {
  if (typeof window === "undefined") return

  // 处理登出事件
  window.addEventListener("storage", (event) => {
    if (event.key === "auth:logout") {
      forceLogout()
    }
  })

  // 处理 Token 过期事件
  window.addEventListener("token:expired", () => {
    console.debug("[Auth] Token expired event received")
    // 可以触发刷新尝试
  })
}
