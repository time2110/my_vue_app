// src/stores/user.ts
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export interface User {
  id: string
  name: string
  avatar?: string
  token?: string
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = (userData: User, userToken: string) => {
    console.log("获取登录状态...")

    user.value = userData
    token.value = userToken
    localStorage.setItem("token", userToken)
  }

  const logout = () => {
    console.log("注销登录状态...")

    user.value = null
    token.value = null
    localStorage.removeItem("token")
  }

  const initialize = () => {
    console.log("初始化登录状态...")

    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      token.value = savedToken
      // 可选：调用 API 获取用户信息
      return
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initialize,
  }
})
