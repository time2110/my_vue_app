# Vue 3 + TypeScript + Vite

# my_vue_app

# 目录

src/
├── api/ # 请求封装
│ └── request.ts # axios 实例 拦截器
├── assets/ # 静态资源（图片、字体）
├── components/ # 公共组件（可复用）
│ ├── About.vue
│ └── NotFound.vue # 404 页面
├── hooks/ # 自定义 hook
│ └── useForm.ts # 表单自定义 hook
├── mock/ # mock 请求
│ └── user.ts # 用户请求 hook
├── router/ # 路由配置
│ ├── guards/ # 路由守卫
│ │ └──index.ts
│ └── index.ts
├── service/ # 接口
│ ├── user.ts
│ └── menu.ts
├── stores/ # Pinia Store
│ ├── index.ts
│ └── user.ts
├── types/ # 全局类型定义
│ ├── api.d.ts
│ └── index.d.ts
├── views/ # 页面级组件（路由对应）
│ ├── Home.vue
│ ├── User/
│ │ └── Login.vue # 登录页面
├── App.vue
└── main.ts
