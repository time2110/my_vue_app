<!-- src/views/Login.vue -->
<template>
  <div class="login">
    <h2>用户登录</h2>
    <input
      v-model="form.username"
      placeholder="用户名" />
    <input
      v-model="form.password"
      type="password"
      placeholder="密码" />
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script setup lang="ts">
import { login } from "@/service/user"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const form = ref({
  username: "admin",
  password: "123456",
})

const handleLogin = async () => {
  try {
    const res = await login(form.value)
    console.log("11", res)

    localStorage.setItem("token", res.data.token)

    router.push("/")
  } catch (error) {
    console.error("登录失败:", error)
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
