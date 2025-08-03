<template>
  <div class="container">
    <button class="back-btn" @click="goBack">← Quay lại</button>

    <div v-if="loading" class="loading">Đang tải chi tiết manga...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="manga" class="content">
      <div class="left-panel">
        <img :src="manga.coverImage" alt="cover" class="cover" />
        <h2>{{ manga.title }}</h2>
        <p><strong>Tác giả:</strong> {{ manga.author }}</p>
        <p><strong>Thể loại:</strong> {{ manga.genre }}</p>
        <p><strong>Giá:</strong> {{ manga.price }} VND</p>
        <p><strong>Mô tả:</strong></p>
        <p class="description">{{ manga.description }}</p>
        <p><strong>Tồn kho:</strong> {{ manga.stock }}</p>
      </div>

      <div class="right-panel">
        <div class="purchase-section">
          <div class="quantity-section">
            <label for="quantity" class="quantity-label">Số lượng:</label>
            <div class="quantity-controls">
              <button 
                class="quantity-btn" 
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
              >
                -
              </button>
              <input 
                id="quantity"
                v-model.number="quantity" 
                type="number" 
                min="1" 
                :max="manga.stock"
                class="quantity-input"
              />
              <button 
                class="quantity-btn" 
                @click="increaseQuantity"
                :disabled="quantity >= manga.stock"
              >
                +
              </button>
            </div>
            <p class="stock-info">Còn lại: {{ manga.stock }} cuốn</p>
          </div>

          <div class="price-section">
            <div class="price-display">
              <span class="price-label">Tổng tiền:</span>
              <span class="total-price">{{ formatPrice(manga.price * quantity) }} VND</span>
            </div>
          </div>

          <div class="action-buttons">
            <button 
              class="btn add-cart" 
              @click="addToCart"
              :disabled="manga.stock === 0"
            >
              🛒 Thêm vào giỏ
            </button>
            <button 
              class="btn buy-now" 
              @click="buyNow"
              :disabled="manga.stock === 0"
            >
              ⚡ Mua ngay
            </button>
          </div>

          <div v-if="manga.stock === 0" class="out-of-stock">
            ❌ Hết hàng
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const manga = ref(null)
const loading = ref(false)
const error = ref(null)
const quantity = ref(1)

// Quantity controls
const increaseQuantity = () => {
  if (quantity.value < manga.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Add to cart function
function addToCart() {
  if (manga.value.stock === 0) {
    alert('❌ Sản phẩm đã hết hàng!')
    return
  }

  cartStore.addToCart({
    mangaId: manga.value._id,
    title: manga.value.title,
    price: manga.value.price,
    quantity: quantity.value,
  })
  
  // Show success message
  alert(`✅ Đã thêm ${quantity.value} cuốn "${manga.value.title}" vào giỏ hàng!`)
}
const fetchManga = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get(`http://localhost:5000/api/mangas/${route.params.id}`)
    manga.value = res.data
  } catch (e) {
    error.value = 'Lỗi khi tải chi tiết manga.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

// Buy now function
const buyNow = async () => {
  if (manga.value.stock === 0) {
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
          redirect: route.fullPath,
          buyNow: 'true',
          mangaId: manga.value._id,
          quantity: quantity.value
        }
      })
    }
    return
  }

  try {
    // Clear current cart
    cartStore.clearCart()
    
    // Add current item to cart
    cartStore.addToCart({
      mangaId: manga.value._id,
      title: manga.value.title,
      price: manga.value.price,
      quantity: quantity.value,
    })

    // Show loading state
    loading.value = true
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Redirect to checkout
    router.push({ 
      name: 'Checkout',
      query: { 
        buyNow: 'true',
        from: 'manga-detail'
      }
    })
    
  } catch (error) {
    console.error('Buy now error:', error)
    alert('❌ Có lỗi xảy ra khi mua hàng. Vui lòng thử lại!')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchManga()
}
)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 15px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  color: #555;
}

.loading,
.error {
  text-align: center;
  font-weight: 600;
  color: #e74c3c;
  margin: 20px 0;
}

.content {
  display: flex;
  gap: 40px;
}

.left-panel {
  flex: 3;
}

.cover {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
  object-fit: cover;
}

.description {
  white-space: pre-wrap;
  line-height: 1.5;
  margin-top: 10px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.purchase-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.quantity-section {
  margin-bottom: 1.5rem;
}

.quantity-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e5e7eb;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
}

.quantity-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.stock-info {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.price-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.price-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-weight: 600;
  color: #e5e7eb;
}

.total-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn:not(:disabled):active {
  transform: translateY(-1px);
}

.add-cart {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.add-cart:not(:disabled):hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.buy-now {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-weight: 700;
}

.buy-now:not(:disabled):hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.out-of-stock {
  text-align: center;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-weight: 600;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 20px;
  }
  
  .right-panel {
    position: static;
  }
  
  .purchase-section {
    padding: 1rem;
  }
  
  .quantity-controls {
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

/* Loading state */
.btn.loading {
  position: relative;
  color: transparent;
}

.btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
