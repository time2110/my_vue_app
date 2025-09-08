import { createPinia } from "pinia" // 👈 导入 Pinia
import { createApp } from "vue"
import App from "./App.vue"
import router, { setupRouter } from "./router"

import { useUserStore } from "./stores/user"
import "./style.css"

const app = createApp(App)
// 👇 创建并注册 Pinia 实例
const pinia = createPinia()
app.use(pinia)
app.use(router)
// 👇 初始化用户状态（恢复登录态）
const userStore = useUserStore()
userStore.initialize()
setupRouter()
app.mount("#app")
