<script setup lang="ts"></script>

<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <!-- RouterView 组件可以使 Vue Router 知道你想要在哪里渲染当前 URL 路径对应的路由组件 -->
    <RouterView />
  </main>
</template>

<style scoped></style>
