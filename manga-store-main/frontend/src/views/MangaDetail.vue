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
        <button class="btn add-cart" @click="addToCart">Add to Cart</button>
        <button class="btn buy-now" @click="buyNow">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'


const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const manga = ref(null)
const loading = ref(false)
const error = ref(null)

function addToCart() {
  cartStore.addToCart({
    mangaId: manga.value._id,
    title: manga.value.title,
    price: manga.value.price,
    quantity: 1,
  })
  alert('Đã thêm vào giỏ hàng')
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

const buyNow = () => {
  alert('Chức năng mua ngay đang phát triển')
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
  gap: 15px;
  justify-content: flex-start;
  align-items: stretch;
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-cart {
  background-color: #3b82f6;
  color: white;
}

.add-cart:hover {
  background-color: #2563eb;
}

.buy-now {
  background-color: #ef4444;
  color: white;
}

.buy-now:hover {
  background-color: #dc2626;
}
</style>
