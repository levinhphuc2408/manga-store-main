<template>
  <div class="success-container">
    <h1>Thanh toán thành công!</h1>
    <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
    <button @click="goHome">Quay về trang chủ</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<style scoped>
.success-container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

button {
  margin-top: 30px;
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
}
</style>
