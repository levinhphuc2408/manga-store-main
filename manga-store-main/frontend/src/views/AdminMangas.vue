<template>
  <div class="admin-container p-6">
    <h1 class="text-2xl font-bold mb-4">Quản lý Manga (Admin)</h1>

    <div v-if="errorMsg" class="mb-2 text-red-400">{{ errorMsg }}</div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full">
        <thead>
          <tr class="bg-blue-600 text-white">
            <th class="px-4 py-2">Ảnh</th>
            <th class="px-4 py-2">Tiêu đề</th>
            <th class="px-4 py-2">Tác giả</th>
            <th class="px-4 py-2">Giá (VND)</th>
            <th class="px-4 py-2">Stock</th>
            <th class="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center py-4">Đang tải...</td>
          </tr>
          <tr v-if="!loading && mangas.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-600">
              Không có manga nào. Kiểm tra backend hoặc quyền.
            </td>
          </tr>
          <tr
            v-for="manga in mangas"
            :key="manga._id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">
              <img
                :src="manga.coverImage || placeholderImage"
                alt="cover"
                class="w-16 h-24 object-cover mx-auto"
                @error="onImgError"
              />
            </td>
            <td class="px-4 py-2">{{ manga.title }}</td>
            <td class="px-4 py-2">{{ manga.author }}</td>
            <td class="px-4 py-2">{{ formatPrice(manga.price) }}</td>
            <td class="px-4 py-2">{{ manga.stock ?? 0 }}</td>
            <td class="px-4 py-2">
              <button
                @click="openEdit(manga)"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
              >
                Sửa
              </button>
              <button
                @click="deleteManga(manga._id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingManga"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-xl font-semibold mb-4">Chỉnh sửa Manga</h2>
        <form @submit.prevent="submitEdit" class="space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                v-model="form.title"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tác giả</label>
              <input
                v-model="form.author"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full border rounded px-3 py-2 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Giá</label>
              <input
                type="number"
                v-model.number="form.price"
                min="0"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                v-model.number="form.stock"
                min="0"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Cover Image URL</label>
              <input
                v-model="form.coverImage"
                class="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              @click="closeEdit"
              class="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
          <div v-if="editError" class="text-red-500 text-sm mt-1">{{ editError }}</div>
        </form>
        <button
          @click="closeEdit"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const mangas = ref([])
const loading = ref(false)
const errorMsg = ref('')
const submitting = ref(false)
const editError = ref('')
const editingManga = ref(null)
const form = ref({
  title: '',
  author: '',
  description: '',
  price: 0,
  stock: 0,
  coverImage: ''
})

const userStore = useUserStore()

// fallback nội bộ
const placeholderImage = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150">
  <rect width="100" height="150" fill="#eee"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#999">No Cover</text>
</svg>
`)

// adjust according to actual backend routes: default assumes admin under /admin/mangas
const baseApi = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
const adminPath = '/admin/mangas' // if your backend uses '/mangas' instead, change this to '/mangas'

const api = axios.create({
  baseURL: `${baseApi}${adminPath}`
})

// attach token if exists
api.interceptors.request.use(cfg => {
  const token = userStore.token
  if (token) {
    cfg.headers = cfg.headers || {}
    cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

const fetchMangas = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await api.get('') // GET to base (/admin/mangas)
    mangas.value = res.data || []
  } catch (err) {
    console.error('fetchMangas error:', err)
    errorMsg.value = 'Không lấy được danh sách manga. Xem console.' 
  } finally {
    loading.value = false
  }
}

const openEdit = (manga) => {
  editingManga.value = manga
  form.value = {
    title: manga.title || '',
    author: manga.author || '',
    description: manga.description || '',
    price: manga.price ?? 0,
    stock: manga.stock ?? 0,
    coverImage: manga.coverImage || ''
  }
  editError.value = ''
}

const closeEdit = () => {
  editingManga.value = null
  editError.value = ''
}

const submitEdit = async () => {
  if (!editingManga.value) return
  submitting.value = true
  editError.value = ''
  try {
    await api.put(`/${editingManga.value._id}`, form.value)
    await fetchMangas()
    closeEdit()
  } catch (err) {
    console.error('submitEdit error:', err)
    editError.value = 'Cập nhật thất bại. Xem console.' 
  } finally {
    submitting.value = false
  }
}

const deleteManga = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa manga này?')) return
  try {
    await api.delete(`/${id}`)
    await fetchMangas()
    alert('Xóa thành công')
  } catch (err) {
    console.error('deleteManga error:', err)
    alert('Xóa thất bại')
  }
}

const formatPrice = (p) => {
  if (p == null) return '-'
  return new Intl.NumberFormat('vi-VN').format(p)
}

const onImgError = (e) => {
  e.target.src = placeholderImage
}

onMounted(() => {
  fetchMangas()
})
</script>

<style scoped>
.admin-container {
  background: #0f172a;
  min-height: 100vh;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  color: #1f2937;
}
th, td {
  border: 1px solid #e2e8f0;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #1d4ed8;
  color: white;
}
button {
  margin: 0 4px;
  padding: 6px 12px;
  cursor: pointer;
} 
input, textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
