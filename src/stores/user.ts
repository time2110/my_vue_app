// src/stores/user.ts
import { userApi, type UserInfo } from "@/api/service/user"
import {
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/utils/auth/token-storage"
import { acceptHMRUpdate, defineStore } from "pinia"
import { computed, reactive } from "vue"

// 用户状态类型
interface UserState extends UserInfo {
  isAuthenticated: boolean // 登录状态
  isLoading: boolean // 加载状态
  error: string | null // 错误信息
}

// 创建用户 store
export const useUserStore = defineStore("user", () => {
  // 1. 状态 (使用 ref/reactive)
  const state = reactive<UserState>({
    id: null,
    name: "",
    email: "",
    phone: "",
    avatar: "",
    roles: [],
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
      if (!getAccessToken()) {
        reset()
        return
      }
      const { data: res } = await userApi.getUserInfo()
      if (!res.data) {
        throw new Error("Invalid user data")
      }
      // 设置用户信息
      setProfile(res.data)
      state.isAuthenticated = true
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
  const login = async (form: { account: string; password: string }) => {
    state.isLoading = true
    state.error = null
    try {
      const { data: res } = await userApi.login(form)
      if (!res.data) {
        throw new Error("Invalid login response")
      }
      ElMessage.success("登录成功")
      setTokens(res.data.token)
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
  const setProfile = (profile: UserInfo) => {
    const { id, name, email, phone, avatar, roles, permissions } = profile
    state.id = id
    state.name = name
    state.email = email
    state.phone = phone
    state.avatar = avatar
    state.roles = roles || []
    state.permissions = permissions || []
  }

  /**
   * 重置用户状态和清除Token
   */
  const reset = () => {
    state.id = null
    state.name = ""
    state.email = ""
    state.phone = ""
    state.avatar = ""
    state.roles = []
    state.permissions = []
    state.isAuthenticated = false
    clearTokens()
  }

  /**
   * 安全登出
   */
  const logout = async () => {
    // try {
    //   await fetch("/api/auth/logout", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${getAccessToken()}`,
    //     },
    //   })
    // } catch (error) {
    //   console.error("[Auth] Logout failed:", error)
    // } finally {
    //   reset()
    //   // 重定向到登录页
    //   if (!window.location.pathname.includes("/login")) {
    //     const redirect = window.location.href
    //     window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
    //   }
    // }
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
