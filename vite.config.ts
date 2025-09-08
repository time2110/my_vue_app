/// <reference types="node" />
// 顶部添加三斜线指令，局部启用
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig, loadEnv } from "vite"
import { viteMockServe } from "vite-plugin-mock"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 👇 Vite 提供了内置函数 loadEnv，专门用于在配置文件中安全加载对应模式的 .env 文件
  const env = loadEnv(mode, process.cwd())
  console.log("当前模式:", mode)
  console.log("APP版本:", env.VITE_APP_VERSION)
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "src/auto-imports.d.ts", // 自动生成类型声明 → 以后不用手动导入 ref, computed, useRouter, useStore 等！
      }),
      viteMockServe({
        mockPath: "src/mock",
        enable: mode === "development", // 👈 只在开发环境启用
        logger: true,
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"), // 👈 映射 @ → src
      },
    },
    server: {
      port: 3000,
      open: mode === "development", // 开发环境自动打开浏览器
    },
    build: {
      sourcemap: mode !== "production", // 非生产环境生成 sourcemap
    },
    define: {
      // 可以定义全局常量（如版本号）
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || "dev"),
    },
  }
})
