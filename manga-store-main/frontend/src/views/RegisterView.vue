<template>
  <div class="auth-container">
    <h1>Đăng ký</h1>
    <form @submit.prevent="handleRegister">
      <label for="username">Tên đăng nhập</label>
      <input id="username" v-model="username" required />

      <label for="email">Email</label>
      <input id="email" type="email" v-model="email" required />

      <label for="password">Mật khẩu</label>
      <input id="password" type="password" v-model="password" required />

      <button type="submit" :disabled="loading">Đăng ký</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>
      Đã có tài khoản?
      <router-link to="/login">Đăng nhập tại đây</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const router = useRouter()

const handleRegister = async () => {
  loading.value = true
  error.value = null
  try {
    await axios.post('http://localhost:5000/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    alert('Đăng ký thành công! Vui lòng đăng nhập.')
    router.push('/')
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Lỗi đăng ký, vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

label {
  display: block;
  margin-top: 15px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  margin-top: 20px;
  padding: 12px;
  width: 100%;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
}

button[disabled] {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 15px;
  font-weight: 600;
  text-align: center;
}
</style>
