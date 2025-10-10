// src/router/guards/index.ts
import { useUserStore } from "@/stores/user"
import type { Router } from "vue-router"

// beforeEach：全局前置守卫，在导航确认前调用 场景：权限校验、标题设置、埋点、重定向
// beforeResolve：全局解析守卫，在导航被确认前，组件内守卫和异步路由加载之后调用 场景：等待数据加载完成后再跳转
// afterEach：全局后置钩子，在导航完成后调用 场景：关闭加载条、埋点、日志

// 页面标题守卫
const setupPageTitleGuard = (router: Router) => {
  router.beforeEach((to) => {
    document.title = to.meta.title || "我的应用"
  })
}

// 登录权限守卫（示例）
const setupPermissionGuard = (router: Router) => {
  const userStore = useUserStore()
  router.beforeEach(async (to, _from, next) => {
    // 初始化用户状态
    if (to.path !== "/login" && !userStore.isAuthenticated) {
      await userStore.init()
    }
    const requiresAuth = to.meta.requiresAuth as boolean

    if (requiresAuth && !userStore.isAuthenticated) {
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      }) // 跳转到登录页
    } else {
      next()
    }
  })
}

// 日志守卫（可选）
const setupLogGuard = (router: Router) => {
  router.afterEach((to, from) => {
    console.log(`[路由跳转] ${from.path} → ${to.path}`)
  })
}

// 导出统一注册函数
export const registerRouterGuards = (router: Router) => {
  setupPageTitleGuard(router)
  setupPermissionGuard(router)
  setupLogGuard(router)
}
