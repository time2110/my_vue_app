// src/utils/request/index.ts
import {
  setupRequestInterceptors,
  setupResponseInterceptors,
} from "./interceptors"

import { ENV } from "@/constants/env"
import axios from "axios"

// 创建 Axios 实例
const service = axios.create({
  baseURL: ENV.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 设置拦截器
setupRequestInterceptors(service)
setupResponseInterceptors(service)

export default service
