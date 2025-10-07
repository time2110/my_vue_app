// src/service/user.ts

import request from "@/api/request"
import type { ApiResponse } from "@/api/request/types"

// 登录参数
export interface LoginParams {
  account: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  username: string
}

// 用户信息
export interface UserInfo {
  id: number
  name: string
  roles: string[]
}

// 登录 API
function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>("/users/login", params)
}

// 获取用户信息
function getUserInfo() {
  return request.get<ApiResponse<UserInfo>>("/users/info")
}

// 登出 API
function logout() {
  return request.post<ApiResponse<null>>("/users/logout")
}

export const userApi = { login, getUserInfo, logout }
