<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">MangaStore</router-link>
    </div>
    <div class="navbar-right">
      <router-link to="/" class="nav-link">Home</router-link>

      <!-- Admin Panel Link - Only show for admin users -->
      <router-link 
        v-if="isAdmin" 
        to="/admin/mangas" 
        class="nav-link admin-link"
      >
        🛠️ Admin Panel
      </router-link>

      <a @click.prevent="goToCart" class="nav-link cart-link">
        Cart ({{ cartCount }})
      </a>
      <router-link to="/orders" class="nav-link">Payment History</router-link>

      <span v-if="userName" class="nav-user">
        Hi, {{ userName }}
        <span v-if="isAdmin" class="admin-badge">ADMIN</span>
      </span>

      <button v-if="isLoggedIn" class="btn-logout" @click="logout">Log out</button>
      <router-link v-else to="/login" class="nav-link">Log in</router-link>
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

const isAdmin = computed(() => userStore.user?.role === 'admin')

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
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-link:active {
  transform: translateY(0);
}

/* Active link styling */
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.admin-link {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-link:hover {
  background: linear-gradient(45deg, #d97706, #b45309);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-decoration: none !important;
}

.admin-badge {
  background-color: #f59e0b;
  color: #1f2937;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
