<script setup lang="ts">
import Head from "./components/Head.vue"
import Sidebar from "./components/Sidebar.vue"
</script>

<template>
  <Head></Head>
  <div class="layout">
    <Sidebar></Sidebar>
    <main class="main-container relative">
      <!-- RouterView 组件可以使 Vue Router 知道你想要在哪里渲染当前 URL 路径对应的路由组件 -->
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
}
.main-container {
}
</style>
