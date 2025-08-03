<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <h1 class="text-3xl font-bold mb-6">Đăng nhập</h1>
    <form @submit.prevent="onSubmit" class="w-full max-w-sm">
      <div class="mb-4">
        <label for="email" class="block mb-2">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full p-2 rounded text-black"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-2">Mật khẩu</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full p-2 rounded text-black"
        />
      </div>
      <p v-if="errorMessage" class="mb-4 text-red-500">{{ errorMessage }}</p>
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Đăng nhập
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const onSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value
    })
    userStore.setToken(response.data.token)
    userStore.setUser(response.data.user)
    // Chuyển hướng về trang Home sau khi đăng nhập thành công
    if (response.data.user.role === 'admin') {
  router.push({ name: 'AdminMangas' })  // Trang admin bạn cần tạo route và component AdminView.vue
} else {
  router.push({ name: 'Home' })   // Người dùng thường
}
    console.log('Login user data:', response.data.user)
  } catch (error) {
    errorMessage.value = 'Đăng nhập thất bại, vui lòng thử lại.'
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
  font-family: Arial, sans-serif;
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
  box-sizing: border-box;
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

.register-text {
  margin-top: 15px;
  text-align: center;
  font-size: 0.9rem;
}
</style>
