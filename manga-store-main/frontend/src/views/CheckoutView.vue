<template>
  <div class="checkout-container">
    <h2>Thanh Toán</h2>

    <div class="order-info">
      <h3>Thông tin sản phẩm</h3>
      <div v-if="cartItems.length === 0">Giỏ hàng của bạn đang trống.</div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.mangaId" class="order-item">
          {{ item.title }} - {{ item.quantity }} x {{ item.price }} VND = {{ (item.quantity * item.price).toFixed(2) }} VND
        </div>
        <div><strong>Tổng tiền:</strong> {{ total.toFixed(2) }} VND</div>
      </div>
    </div>

    <h3>Thông tin khách hàng</h3>
    <form @submit.prevent="handleSubmit">
      <label for="name">Tên</label>
      <input id="name" v-model="name" required />

      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" required />

      <label for="phone">Số điện thoại</label>
      <input id="phone" v-model="phone" required />

      <button type="submit" :disabled="loading || cartItems.length === 0">
        {{ loading ? 'Đang xử lý...' : 'Thanh Toán' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const cartItems = computed(() => cartStore.items)
const total = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const name = ref('')
const email = ref('')
const phone = ref('')

const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (cartItems.value.length === 0) {
      error.value = 'Giỏ hàng đang trống, không thể thanh toán.'
      loading.value = false
      return
    }

    const orderPayload = {
      customer: {
        name: name.value,
        email: email.value,
        phone: phone.value,
      },
      items: cartItems.value.map(item => ({
        mangaId: item.mangaId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: total.value,
    }

    await axios.post('http://localhost:5000/api/orders', orderPayload, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })

    alert('Thanh toán thành công!')

    router.push('/success')

    // Clear cart sau khi chuyển trang để tránh ảnh hưởng form
    setTimeout(() => {
      cartStore.clearCart()
    }, 500)
  } catch (err) {
    error.value = 'Lỗi khi gửi đơn hàng, vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #1e293b;
  color: white;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.order-info {
  margin-bottom: 20px;
}

.order-item {
  margin-bottom: 5px;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #3b82f6; /* viền màu xanh dương sáng */
  background-color: #1e40af; /* nền xanh đậm */
  color: #e0e7ff; /* chữ màu sáng */
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input::placeholder {
  color: #a5b4fc; /* màu placeholder nhẹ nhàng */
}

input:focus {
  border-color: #60a5fa; /* đổi viền sáng hơn khi focus */
  background-color: #2563eb; /* nền sáng hơn khi focus */
  color: white;
}

button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button[disabled] {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error {
  color: #ff4949;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
