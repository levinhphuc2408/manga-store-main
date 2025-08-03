<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">MangaStore</router-link>
    </div>
    <div class="navbar-right">
      <router-link to="/" class="nav-link">Home</router-link>

      <a @click.prevent="goToCart" class="nav-link cart-link">
        Cart ({{ cartCount }})
      </a>
      <router-link to="/orders" class="nav-link">Lịch sử đơn hàng</router-link>

      <span v-if="userName" class="nav-user">Hi, {{ userName }}</span>

      <button v-if="isLoggedIn" class="btn-logout" @click="logout">Đăng xuất</button>
      <router-link v-else to="/login" class="nav-link">Đăng nhập</router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const cartCount = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
)

const isLoggedIn = computed(() => userStore.isLoggedIn)

const userName = computed(() => (userStore.user ? userStore.user.username : ''))

function goToCart() {
  router.push('/cart')
}

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #3b82f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: white;
  font-family: Arial, sans-serif;
}

.navbar-left .logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
}

.nav-link:hover {
  text-decoration: underline;
}

.cart-link {
  position: relative;
  font-weight: 700;
}

.nav-user {
  font-weight: 600;
  margin-right: 10px;
}

.btn-logout {
  background-color: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-logout:hover {
  background-color: #dc2626;
}
</style>
