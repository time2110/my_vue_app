// src/utils/auth/csrf.ts

/**
 * 从 Cookie 获取 CSRF Token
 */
export const getCsrfToken = (): string => {
  return getCookie("csrf_token") || ""
}

/**
 * 安全设置 CSRF Token
 */
export const setCsrfToken = (token: string) => {
  setCookie("csrf_token", token, {
    path: "/",
    secure: true,
    sameSite: "Strict",
    maxAge: 900, // 15 分钟
  })
}

/**
 * 从 Cookie 获取值
 */
export const getCookie = (name: string): string => {
  if (typeof document === "undefined") return ""

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift()!
  return ""
}

/**
 * 设置 Cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    path?: string
    secure?: boolean
    sameSite?: "Strict" | "Lax" | "None"
    maxAge?: number
  } = {}
) => {
  if (typeof document === "undefined") return

  const {
    path = "/",
    secure = true,
    sameSite = "Strict",
    maxAge = 900,
  } = options

  const expires = new Date(Date.now() + maxAge * 1000).toUTCString()

  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
  ]

  if (secure) cookieParts.push("Secure")
  if (sameSite) cookieParts.push(`SameSite=${sameSite}`)

  document.cookie = cookieParts.join("; ")
}
