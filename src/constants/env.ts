// src/constants/env.ts
export const ENV = {
  // 基础URL（从Vite环境变量获取）
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",

  // 环境标识
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV || "development",

  // 是否开启调试
  VITE_APP_DEBUG: import.meta.env.VITE_APP_DEBUG === "true",

  // Sentry DSN（错误监控）
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || "",

  // 其他环境变量...
}
