<template>
  <div>
    <h1>Manga List </h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="manga-list">
      <div
        v-for="manga in mangas"
        :key="manga._id"
        class="manga-item"
        @click="goToDetail(manga._id)"
      >
        <img :src="manga.coverImage" alt="cover" class="cover" />
        <h3>{{ manga.title }}</h3>
        <p>Price: {{ manga.price }} VND</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const mangas = ref([])
const loading = ref(false)
const error = ref(null)
const router = useRouter()

const fetchMangas = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('http://localhost:5000/api/mangas')
    mangas.value = res.data
  } catch (e) {
    error.value = 'Lỗi khi tải danh sách manga.'
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push({ name: 'MangaDetail', params: { id } })
}

onMounted(() => {
  fetchMangas()
})
</script>

<style scoped>
.manga-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.manga-item {
  width: 180px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  transition: box-shadow 0.3s;
}
.manga-item:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}
.cover {
  width: 150px;
  height: 200px;
  object-fit: cover;
}
</style>
