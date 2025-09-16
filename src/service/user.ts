// src/service/user.ts

import request from "@/utils/request"
import type { ApiResponse } from "@/utils/request/errors/types"

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  username: string
  name: string
}

// 用户信息
export interface UserInfo {
  id: number
  name: string
  roles: string[]
}

// 登录 API
export function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>("/user/login", params)
}

// 获取用户信息
export function getUserInfo() {
  return request.get<ApiResponse<UserInfo>>("/user/info")
}
