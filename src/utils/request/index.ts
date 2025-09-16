// src/utils/request/index.ts
import { createAxiosInstance } from "./core"
import {
  setupRequestInterceptors,
  setupResponseInterceptors,
} from "./interceptors"

// 创建 Axios 实例
const service = createAxiosInstance()

// 设置拦截器
setupRequestInterceptors(service)
setupResponseInterceptors(service)

export default service
