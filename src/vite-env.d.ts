/// <reference types="vite/client" />

// 类型“ImportMeta”上不存在属性“env”。
// 这是因为在 TypeScript 中，默认情况下 import.meta 对象没有 env 属性的类型定义
// —— 而 Vite 在运行时会注入 import.meta.env，但 TS 不知道这件事
// 扩展 ImportMeta 接口，告诉 TypeScript：“Vite 会给 import.meta 添加一个 env 属性”。

// 扩展 ImportMetaEnv 接口，声明你用到的环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_NAME: string
  // 可继续添加你项目中使用的其他 VITE_ 开头变量
}

// 扩展 ImportMeta，确保包含 env
interface ImportMeta {
  readonly env: ImportMetaEnv
}
