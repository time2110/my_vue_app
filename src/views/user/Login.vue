<!-- src/views/Login.vue -->
<template>
  <div class="login-container center-position">
    <el-form
      ref="loginFormRef"
      style="max-width: 600px"
      @submit.prevent="onSubmit"
      label-width="auto"
      class="demo-ruleForm">
      <el-form-item
        label="账号"
        :error="errors.account">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item
        label="密码"
        :error="errors.password">
        <el-input v-model="form.password" />
      </el-form-item>
      <div class="justify-center">
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
import { userApi } from "@/api/service/user"
import { useForm } from "@/hooks/useForm"
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
    const { data: res } = await userApi.login(form)
    localStorage.setItem("token", "" + res.data?.token)
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
}
</style>
