<script setup>
import "tailwindcss";
import { RouterView } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const router = useRouter()
const isPageLoading = ref(false)

// Determine transition type based on route
const transitionName = computed(() => {
  const fromPath = route.meta?.from || ''
  const toPath = route.path
  
  // Admin transitions
  if (toPath.includes('/admin') || fromPath.includes('/admin')) {
    return 'admin-transition'
  }
  
  // Auth transitions
  if (toPath.includes('/login') || toPath.includes('/register')) {
    return 'auth-transition'
  }
  
  // Cart/checkout flow
  if (toPath.includes('/cart') || toPath.includes('/checkout')) {
    return 'slide-left'
  }
  
  // Default smooth transition
  return 'fade-slide'
})

// Loading state management
const onBeforeEnter = () => {
  isPageLoading.value = true
}

const onAfterEnter = () => {
  setTimeout(() => {
    isPageLoading.value = false
  }, 300)
}

// Watch route changes for smooth transitions
watch(route, (to, from) => {
  // Store previous route for transition logic
  to.meta.from = from.path
})

// Handle router navigation with loading
router.beforeEach((to, from, next) => {
  isPageLoading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    isPageLoading.value = false
  }, 500)
})
</script>

<template>
  <Suspense>
    <div class="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      
      <!-- Page transition wrapper -->
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="transitionName" 
          mode="out-in"
          @before-enter="onBeforeEnter"
          @after-enter="onAfterEnter"
        >
          <div :key="route.path" class="flex-grow relative">
            <!-- Loading overlay -->
            <div 
              v-if="isPageLoading" 
              class="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300"
            >
              <div class="text-center">
                <div class="loading-spinner mb-4"></div>
                <p class="text-white text-lg">Đang tải...</p>
              </div>
            </div>
            
            <!-- Page content -->
            <component :is="Component" class="page-content" />
          </div>
        </transition>
      </router-view>
      
      <Footer />
    </div>
  </Suspense>
</template>





<style scoped>
/* Page content styling */
.page-content {
  min-height: calc(100vh - 120px);
  padding: 1rem;
}

/* Loading spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Default fade-slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Admin transition - more professional */
.admin-transition-enter-active,
.admin-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-transition-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.admin-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

/* Auth transition - slide from right */
.auth-transition-enter-active,
.auth-transition-leave-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.auth-transition-enter-from {
  opacity: 0;
  transform: translateX(100px) rotateY(15deg);
}

.auth-transition-leave-to {
  opacity: 0;
  transform: translateX(-100px) rotateY(-15deg);
}

/* Slide left for cart flow */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Smooth hover effects for interactive elements */
.page-content * {
  transition: all 0.2s ease;
}

/* Button hover improvements */
.page-content button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card hover effects */
.page-content .manga-item:hover,
.page-content .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Input focus improvements */
.page-content input:focus,
.page-content textarea:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Navbar link active state */
.navbar .router-link-active {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px 12px;
  transition: all 0.3s ease;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Page enter animations for content */
.page-content > * {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for lists */
.page-content .manga-list .manga-item,
.page-content table tr {
  animation: fadeInStagger 0.5s ease-out;
  animation-fill-mode: both;
}

.page-content .manga-list .manga-item:nth-child(1) { animation-delay: 0.1s; }
.page-content .manga-list .manga-item:nth-child(2) { animation-delay: 0.2s; }
.page-content .manga-list .manga-item:nth-child(3) { animation-delay: 0.3s; }
.page-content .manga-list .manga-item:nth-child(4) { animation-delay: 0.4s; }
.page-content .manga-list .manga-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInStagger {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive improvements */
@media (max-width: 768px) {
  .page-content {
    padding: 0.5rem;
  }
  
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    transform: translateY(10px);
  }
}

/* Dark mode improvements */
@media (prefers-color-scheme: dark) {
  .loading-spinner {
    border-color: rgba(255, 255, 255, 0.2);
    border-top-color: #60a5fa;
  }
}
</style>
