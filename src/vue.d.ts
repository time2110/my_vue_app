// src/vue.d.ts
// 无法找到模块“../components/Home.vue”的声明文件。
// TypeScript 不知道 .vue 文件是什么模块，没有对应的类型声明，所以会报错
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
