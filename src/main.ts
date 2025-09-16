import { createPinia } from "pinia" // 👈 导入 Pinia
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import "./_reset.scss"
// 引入 Element Plus 基础样式（必需）
import "element-plus/dist/index.css"
import { useUserStore } from "./stores/user"
import { initAuthSync } from "./utils/auth/sync"
import service from "./utils/request"

const app = createApp(App)
// 👇 创建并注册 Pinia 实例
const pinia = createPinia()

// 初始化认证同步（多标签页）
initAuthSync()
app.use(pinia)
app.use(router)
// 挂载应用前初始化用户状态
const userStore = useUserStore()
userStore.init().finally(() => {
  app.mount("#app")
})

/**
 * 安全登出
 */
export const logout = async () => {
  try {
    await service.post(
      "/api/auth/logout",
      {},
      {
        skipAuth: true,
      }
    )
  } catch (error) {
    console.error("[Auth] Logout failed:", error)
  } finally {
    const userStore = useUserStore()
    userStore.reset()

    // 重定向到登录页
    if (!window.location.pathname.includes("/login")) {
      const redirect = window.location.href
      window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
    }
  }
}
