// src/service/user.ts

import request from "../request"
import type { ApiResponse } from "../request/types"

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
function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>("/user/login", params)
}

// 获取用户信息
function getUserInfo() {
  return request.get<ApiResponse<UserInfo>>("/user/info")
}

// 登出 API
function logout() {
  return request.post<ApiResponse<null>>("/user/logout")
}

export const userApi = { login, getUserInfo, logout }
