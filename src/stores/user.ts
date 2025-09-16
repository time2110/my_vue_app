// src/stores/user.ts
import { initAuthSync } from "@/utils/auth/sync"
import { startTokenExpirationCheck } from "@/utils/auth/token-expiration"
import {
  clearTokens,
  getAccessToken,
  hasValidToken,
  setTokens,
} from "@/utils/auth/token-storage"
import { acceptHMRUpdate, defineStore } from "pinia"
import { computed, reactive } from "vue"

// 用户信息类型
interface UserProfile {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "guest"
  permissions?: string[]
}

// 用户状态类型
interface UserState {
  id: number | null
  name: string
  email: string
  role: "admin" | "user" | "guest"
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// 创建用户 store
export const useUserStore = defineStore("user", () => {
  // 1. 状态 (使用 ref/reactive)
  const state = reactive<UserState>({
    id: null,
    name: "",
    email: "",
    role: "guest",
    permissions: [],
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // 2. 计算属性
  const isAuthReady = computed(() => {
    return !state.isLoading && state.isAuthenticated
  })

  // 3. 操作 (业务逻辑)

  /**
   * 安全初始化 - 检查认证状态并加载用户信息
   */
  const init = async () => {
    state.isLoading = true
    state.error = null

    try {
      // 1. 检查是否有有效 Token
      if (!hasValidToken()) {
        reset()
        return
      }

      // 2. 获取用户信息
      const token = getAccessToken()
      if (!token) {
        reset()
        return
      }

      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const { data } = await response.json()

      // 3. 设置用户信息（安全！）
      setProfile(data)
      state.isAuthenticated = true

      // 4. 吿诉 Token 过期检查
      startTokenExpirationCheck()

      // 5. 初始化认证同步
      initAuthSync()
    } catch (error) {
      console.error("[UserStore] Initialization failed:", error)
      reset()
      state.error = "用户状态初始化失败"
    } finally {
      state.isLoading = false
    }
  }

  /**
   * 登录
   */
  const login = async (username: string, password: string) => {
    state.isLoading = true
    state.error = null

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "登录失败")
      }

      const { accessToken, refreshToken, user } = await response.json()

      // ✅ 关键：安全设置 Token（不存储在 Pinia 中）
      setTokens(accessToken, refreshToken)

      // ✅ 安全：设置用户信息（不含 Token）
      setProfile(user)
      state.isAuthenticated = true

      // 启动 Token 过期检查
      startTokenExpirationCheck()

      // 初始化认证同步
      initAuthSync()
    } catch (error) {
      state.error = error instanceof Error ? error.message : "登录失败"
      throw error
    } finally {
      state.isLoading = false
    }
  }

  /**
   * 设置用户信息（安全！）
   */
  const setProfile = (profile: UserProfile) => {
    state.id = profile.id
    state.name = profile.name
    state.email = profile.email
    state.role = profile.role
    state.permissions = profile.permissions || []
  }

  /**
   * 重置用户状态（不含Token！）
   */
  const reset = () => {
    state.id = null
    state.name = ""
    state.email = ""
    state.role = "guest"
    state.permissions = []
    state.isAuthenticated = false

    // ✅ 关键：清除 Token（不通过 Pinia）
    clearTokens()
  }

  /**
   * 安全登出
   */
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
    } catch (error) {
      console.error("[Auth] Logout failed:", error)
    } finally {
      reset()

      // 重定向到登录页
      if (!window.location.pathname.includes("/login")) {
        const redirect = window.location.href
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
      }
    }
  }

  // 4. 暴露 API
  return {
    // 状态
    ...toRefs(state),

    // 计算属性
    isAuthReady,

    // 操作
    init,
    login,
    setProfile,
    reset,
    logout,
  }
})

// 使 HMR 正常工作
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
