// // src/utils/request/auth/handle-401.ts

// import { broadcastLogout, forceLogout } from "@/utils/auth/sync"
// import {
//   enqueueRequest,
//   getRefreshDelay,
//   getRefreshState,
//   incrementRefreshAttempts,
//   processQueue,
//   refreshAccessToken,
//   resetRefreshState,
// } from "@/utils/auth/token-refresh"
// import { clearTokens } from "@/utils/auth/token-storage"
// import type {
//   AxiosError,
//   AxiosInstance,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios"

// /**
//  * 401 未认证处理（核心：Token 刷新机制）
//  */
// export const handleUnauthorized = async (
//   service: AxiosInstance,
//   error: AxiosError,
//   config: InternalAxiosRequestConfig
// ): Promise<AxiosResponse> => {
//   const { isRefreshing, refreshAttempts, MAX_REFRESH_ATTEMPTS } =
//     getRefreshState()
//   const context = createErrorContext(error, config)

//   // 跳过特殊请求（防止无限循环）
//   if (config.skipAuth) {
//     return Promise.reject(enhanceError(error, context))
//   }

//   // 检查是否已在刷新 Token
//   if (isRefreshing) {
//     return enqueueRequest(config)
//   }

//   // 标记为刷新中
//   ;(getRefreshState() as any).isRefreshing = true

//   try {
//     // 尝试刷新 Token
//     const newToken = await refreshAccessToken(service)

//     // 重试队列中的请求
//     await processQueue(service, null, newToken)

//     // 重试当前请求
//     config.headers.set("Authorization", `Bearer ${newToken}`)
//     config._retry = true
//     return service(config)
//   } catch (refreshError) {
//     // 刷新失败，清除 Token
//     clearTokens()

//     // 处理队列
//     await processQueue(service, refreshError as Error)

//     // 检查是否达到最大尝试次数
//     if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
//       console.error("[Auth] Max refresh attempts exceeded")
//       resetRefreshState()
//       forceLogout()
//       return Promise.reject(
//         enhanceError(error, {
//           ...context,
//           errorCode: "AUTH_SESSION_EXPIRED",
//         })
//       )
//     }

//     // 指数退避重试
//     incrementRefreshAttempts()

//     console.warn(
//       `[Auth] Refresh failed (${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}), ` +
//         `retrying in ${getRefreshDelay()}ms...`
//     )

//     await new Promise((resolve) => setTimeout(resolve, getRefreshDelay()))

//     // 递归重试
//     return handleUnauthorized(service, error, config)
//   } finally {
//     // 重置刷新状态
//     ;(getRefreshState() as any).isRefreshing = false
//   }
// }

// /**
//  * 403 禁止访问处理
//  */
// export const handleForbidden = (
//   error: AxiosError,
//   config: InternalAxiosRequestConfig,
//   apiError: ApiError
// ) => {
//   const context = createErrorContext(error, config)

//   // 检查是否是权限不足
//   if (apiError.code === "PERMISSION_DENIED") {
//     console.warn(`[Access Denied] ${context.url}`)

//     // 重置用户状态
//     // 注意：这里不调用 Pinia，只清除 Token
//     clearTokens()

//     // 广播登出事件
//     broadcastLogout()

//     // 仅当不在登录页时重定向
//     if (
//       typeof window !== "undefined" &&
//       !window.location.pathname.includes("/login")
//     ) {
//       const redirect = window.location.href
//       window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
//     }

//     return Promise.reject(
//       enhanceError(error, {
//         ...context,
//         errorCode: "PERMISSION_DENIED",
//       })
//     )
//   }

//   return Promise.reject(enhanceError(error, context))
// }
