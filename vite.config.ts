/// <reference types="node" />
// 顶部添加三斜线指令，局部启用
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig, loadEnv } from "vite"

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
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
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
      proxy: {
        // 配置代理
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path: string) => {
            const newPath = path.replace(/^\/api/, "")
            return newPath
          },
        },
      },
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
