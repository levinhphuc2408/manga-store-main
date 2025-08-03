<template>
  <div class="orders-container">
    <h1>Lịch sử đơn hàng</h1>

    <div v-if="loading">Đang tải đơn hàng...</div>

    <div v-else>
      <div v-if="orders.length === 0">
        Bạn chưa có đơn hàng nào.
      </div>
      <ul v-else class="order-list">
        <li v-for="order in orders" :key="order._id" class="order-item">
          <div><strong>Mã đơn hàng:</strong> {{ order._id }}</div>
          <div><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</div>
          <div><strong>Tổng tiền:</strong> {{ formatPrice(order.totalPrice) }}</div>
          <div><strong>Trạng thái:</strong> {{ order.status }}</div>
          <div><strong>Chi tiết sản phẩm:</strong></div>
          <ul>
            <li v-for="item in order.items" :key="item.mangaId">
              {{ item.title }} — Giá: {{ formatPrice(item.price) }} x {{ item.quantity }}
            </li>
          </ul>
          <hr />
        </li>
      </ul>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const userStore = useUserStore()

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

async function fetchOrders() {
  if (!userStore.token) {
    error.value = 'Bạn chưa đăng nhập.'
    return
  }
  loading.value = true
  error.value = null

  try {
    const res = await axios.get('http://localhost:5000/api/orders/myorders', {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    orders.value = res.data
  } catch (e) {
    error.value = 'Lỗi khi tải đơn hàng.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.order-list {
  list-style-type: none;
  padding: 0;
}

.order-item {
  background: #f0f4ff;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.order-item > div {
  margin-bottom: 8px;
}

.error {
  color: red;
  font-weight: 600;
  margin-top: 15px;
  text-align: center;
}
</style>
