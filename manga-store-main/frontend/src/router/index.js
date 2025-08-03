import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrdersView from '../views/OrdersView.vue'  // bạn tạo thêm trang lịch sử đơn hàng
import MangaDetail from '../views/MangaDetail.vue'
import SuccessView from '../views/SuccessView.vue'
import AdminMangas from '../views/AdminMangas.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: false } },
  { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { requiresAuth: false } },
  { path: '/cart', name: 'Cart', component: CartView, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/manga/:id', name: 'MangaDetail', component: MangaDetail, props: true },
  { path: '/success', name: 'Success', component: SuccessView },
  { path: '/admin/mangas', name: 'AdminMangas', component: AdminMangas, meta: { requiresAuth: true, requiresAdmin: true }}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard global
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (!userStore.user && userStore.token) {
    await userStore.loadFromLocalStorage()
  }
    console.log('User in guard:', userStore.user)
  console.log('Token in guard:', userStore.token)

  const requiresAuth = to.meta.requiresAuth || false
  const requiresAdmin = to.meta.requiresAdmin || false
  const isLoggedIn = !!userStore.token
  const userRole = userStore.user?.role || null

    console.log({ requiresAuth, requiresAdmin, isLoggedIn, userRole })


  if (requiresAuth && !isLoggedIn) {
    // Nếu chưa đăng nhập thì chuyển về trang login
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (requiresAdmin && userRole !== 'admin') {
    // Nếu không phải admin mà truy cập route admin thì chuyển về trang chủ
    next({ name: 'Home' })
  } else {
    // Cho phép truy cập
    next()
  }
})

export default router
