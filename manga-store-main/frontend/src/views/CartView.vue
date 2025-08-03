<template>
  <div class="cart-container">
    <h1>Giỏ hàng của bạn</h1>
    <div v-if="cartStore.items.length === 0">
      Giỏ hàng trống.
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Tên Manga</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
          <th>Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartStore.items" :key="item.mangaId">
          <td>{{ item.title }}</td>
          <td>{{ item.price }} VND</td>
          <td>
            <input
              type="number"
              min="1"
              v-model.number="item.quantity"
              @change="updateQuantity(item.mangaId, item.quantity)"
            />
          </td>
          <td>{{ (item.price * item.quantity).toFixed(2) }} VND</td>
          <td><button @click="removeFromCart(item.mangaId)">Xóa</button></td>
        </tr>
      </tbody>
    </table>

    <div class="total" v-if="cartStore.items.length > 0">
      <strong>Tổng tiền: </strong> {{ cartStore.totalPrice.toFixed(2) }} VND
    </div>

    <button
      v-if="cartStore.items.length > 0"
      class="checkout-btn"
      @click="goToCheckout"
    >
      Thanh Toán
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

function removeFromCart(id) {
  cartStore.removeFromCart(id)
}

function updateQuantity(id, qty) {
  if (qty < 1) qty = 1
  cartStore.updateQuantity(id, qty)
}

function goToCheckout() {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  border-bottom: 2px solid #333;
  text-align: left;
  padding: 10px;
}

tbody td {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

input[type='number'] {
  width: 60px;
  padding: 5px;
}

button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 5px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #dc2626;
}

.total {
  margin-top: 20px;
  font-size: 1.2rem;
  text-align: right;
}

.checkout-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #1d4ed8;
}
</style>
