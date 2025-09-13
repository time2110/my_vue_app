import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"
import { registerRouterGuards } from "./guards"

// 定义路由类型（可选，但推荐 TS 项目使用）
declare module "vue-router" {
  interface RouteMeta {
    title?: string
    requiresAuth?: Boolean
  }
}

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: { title: "首页", requiresAuth: true },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/components/About.vue"),
    meta: { title: "关于" },
  },
  // 404 页面（可选）
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/NotFound.vue"),
    meta: { title: "页面不存在" },
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("@/views/user/Login.vue"),
    meta: { title: "登录" },
  },
]

const router = createRouter({
  history: createWebHistory(), // HTML5 History 模式
  routes,
})

export const setupRouter = () => {
  // 👇 注册所有守卫（关键一步！）
  registerRouterGuards(router) // ✅ 延迟执行！
}

export default router
