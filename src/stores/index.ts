// src/stores/index.ts（统一导出类型）
import type { useUserStore } from "./user"

// 定义所有 store 类型
export type UserStore = ReturnType<typeof useUserStore>

// 可选：定义全局 store 类型（用于插件或工具函数）
declare module "pinia" {
  export interface PiniaCustomProperties {
    // 可以添加全局属性，如 $http, $api 等
  }
}
