<template>
  <div class="manga-card" @click="goToDetail">
    <div class="card-image">
      <img 
        :src="manga.coverImage || placeholderImage" 
        :alt="manga.title"
        class="cover-image"
        @error="onImageError"
      />
      <div class="overlay">
        <button class="quick-view-btn" @click.stop="$emit('quickView', manga)">
          👁️ Xem nhanh
        </button>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="manga-title">{{ manga.title }}</h3>
      <p class="manga-author">{{ manga.author }}</p>
      <p class="manga-genre" v-if="manga.genre">{{ manga.genre }}</p>
      
      <div class="price-section">
        <span class="price">{{ formatPrice(manga.price) }} VND</span>
        <span class="stock" :class="{ 'out-of-stock': manga.stock === 0 }">
          {{ manga.stock > 0 ? `Còn ${manga.stock}` : 'Hết hàng' }}
        </span>
      </div>
      
      <div class="card-actions">
        <button 
          class="btn add-to-cart" 
          @click.stop="addToCart"
          :disabled="manga.stock === 0"
        >
          🛒 Thêm vào giỏ
        </button>
        <button 
          class="btn buy-now" 
          @click.stop="buyNow"
          :disabled="manga.stock === 0"
        >
          ⚡ Mua ngay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

// Props
const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['quickView'])

// Composables
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// Placeholder image
const placeholderImage = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
  <rect width="200" height="300" fill="#f3f4f6"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#9ca3af">No Cover</text>
</svg>
`)

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const onImageError = (event) => {
  event.target.src = placeholderImage
}

const goToDetail = () => {
  router.push({ name: 'MangaDetail', params: { id: props.manga._id } })
}

const addToCart = () => {
  if (props.manga.stock === 0) {
    alert('❌ Sản phẩm đã hết hàng!')
    return
  }

  cartStore.addToCart({
    mangaId: props.manga._id,
    title: props.manga.title,
    price: props.manga.price,
    quantity: 1,
  })
  
  alert(`✅ Đã thêm "${props.manga.title}" vào giỏ hàng!`)
}

const buyNow = () => {
  if (props.manga.stock === 0) {
    alert('❌ Sản phẩm đã hết hàng!')
    return
  }

  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    const shouldLogin = confirm('Bạn cần đăng nhập để mua hàng. Chuyển đến trang đăng nhập?')
    if (shouldLogin) {
      router.push({ 
        name: 'Login', 
        query: { 
          redirect: `/manga/${props.manga._id}`,
          buyNow: 'true'
        }
      })
    }
    return
  }

  // Clear cart and add item
  cartStore.clearCart()
  cartStore.addToCart({
    mangaId: props.manga._id,
    title: props.manga.title,
    price: props.manga.price,
    quantity: 1,
  })

  // Redirect to checkout
  router.push({ 
    name: 'Checkout',
    query: { 
      buyNow: 'true',
      from: 'manga-card'
    }
  })
}
</script>

<style scoped>
.manga-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.manga-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.manga-card:hover .cover-image {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.manga-card:hover .overlay {
  opacity: 1;
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-view-btn:hover {
  background: white;
  transform: scale(1.05);
}

.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.manga-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.manga-author {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
}

.manga-genre {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #3b82f6;
}

.stock {
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 600;
}

.stock.out-of-stock {
  color: #ef4444;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.add-to-cart {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.add-to-cart:not(:disabled):hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.buy-now {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.buy-now:not(:disabled):hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* Responsive */
@media (max-width: 768px) {
  .card-image {
    height: 240px;
  }
  
  .card-content {
    padding: 0.75rem;
  }
  
  .manga-title {
    font-size: 1rem;
  }
  
  .btn {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
}

/* Animation */
.manga-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>