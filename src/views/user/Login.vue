<!-- src/views/Login.vue -->
<template>
  <div class="login-container center-position">
    <el-form
      ref="loginFormRef"
      style="max-width: 600px"
      @submit.prevent="onSubmit"
      label-width="auto"
      size="large"
      class="demo-ruleForm">
      <el-form-item
        label="账号"
        :error="errors.account">
        <el-input
          placeholder="请输入邮箱/手机号"
          v-model="form.account" />
      </el-form-item>
      <el-form-item
        label="密码"
        :error="errors.password">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="form.password"
          show-password
          ><template
            class="el-input__append"
            #append
            >忘记密码</template
          ></el-input
        >
      </el-form-item>
      <div class="justify-center btn-group">
        <el-button
          type="primary"
          plain
          >注册</el-button
        >
        <el-button
          type="primary"
          native-type="submit"
          >登录</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "@/hooks/useForm"
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"

const router = useRouter()

const { form, errors, validate } = useForm({
  initialValues: {
    account: "admin",
    password: "123456",
  },
  rules: {
    account: [{ required: true, message: "请输入账号" }],
    password: [{ required: true, message: "请输入密码" }],
  },
})

const handleLogin = async () => {
  try {
    await useUserStore().login(form)
    router.push("/")
  } catch (error) {
    // console.error("登录失败:", error)
  }
}
const onSubmit = async () => {
  const valid = await validate()

  if (valid) {
    handleLogin()
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: rgba($color: #fff, $alpha: 0);
    border-bottom: #a297af 1px solid;
    border-radius: 0;
    color: aqua;
  }
  :deep(.el-input-group__append) {
    background-color: rgba($color: #fff, $alpha: 0);
    border-bottom: #a297af 1px solid;
    box-shadow: none;
    border-radius: 0;
  }
  :deep(.el-input__inner::placeholder) {
    color: #8b8f97;
    opacity: 1;
  }
  .btn-group {
    .el-button {
      width: 50%;
    }
  }
}
</style>
