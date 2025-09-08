// src/mock/user.ts
import Mock from "mockjs"
import type { MockMethod } from "vite-plugin-mock"

interface RequestBody {
  username?: string
  password?: string
  // 根据你的接口添加其他字段
}

export default [
  {
    url: "/api/user/login",
    method: "post",
    response: ({ body }: { body: RequestBody }) => {
      const { username, password } = body
      if (username === "admin" && password === "123456") {
        return {
          code: 200,
          message: "登录成功",
          data: {
            token: Mock.Random.string(32),
            username: "admin",
            name: "管理员",
          },
        }
      } else {
        return {
          code: 401,
          message: "用户名或密码错误",
        }
      }
    },
  },
  {
    url: "/api/user/info",
    method: "get",
    response: () => {
      return {
        code: 200,
        data: {
          id: 1,
          name: "管理员",
          roles: ["admin"],
        },
      }
    },
  },
] as MockMethod[]
