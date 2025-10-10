<script lang="ts" setup>
import router from "@/router"

const handleSelect = (key: string) => {
  if (key === "1-0") {
    router.push("/editUserInfo")
  }
}
</script>

<template>
  <el-menu
    class="header-container"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect">
    <el-menu-item index="0">
      <img
        style="width: 100px"
        src="https://element-plus.org/images/element-plus-logo.svg"
        alt="Element logo" />
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>账号设置</template>
      <el-menu-item index="1-0">修改信息</el-menu-item>
      <el-menu-item index="1-1">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 0;
}
</style>
