// src/types/axios.d.ts
import "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    /**
     * 跳过认证处理
     * 用于刷新Token自身的请求，防止无限循环
     */
    skipAuth?: boolean

    /**
     * 标记为已重试的请求
     * 防止重复触发刷新流程
     */
    _retry?: boolean

    /**
     * 请求优先级
     * 用于刷新队列中的请求排序
     */
    priority?: number
  }
}
