<template>
  <div class="admin-container p-6">
    <h1 class="text-2xl font-bold mb-4">Quản lý Manga (Admin)</h1>

    <!-- Debug info -->
    <div v-if="editingManga" class="mb-2 text-green-400">
      Debug: Popup đang mở cho manga: {{ editingManga.title }}
    </div>

    <div v-if="errorMsg" class="mb-2 text-red-400">{{ errorMsg }}</div>

    <!-- Add new manga button -->
    <div class="mb-6 flex justify-between items-center">
      <button
        @click="openAdd"
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        ➕ Thêm Manga Mới
      </button>
      <div class="text-sm text-gray-400">
        Tổng: {{ mangas.length }} manga
      </div>
    </div>

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
            <td class="px-4 py-2 text-gray-900">{{ manga.title }}</td>
            <td class="px-4 py-2 text-gray-900">{{ manga.author }}</td>
            <td class="px-4 py-2 text-gray-900">{{ formatPrice(manga.price) }}</td>
            <td class="px-4 py-2 text-gray-900">{{ manga.stock ?? 0 }}</td>
            <td class="px-4 py-2">
              <button
                @click="openEdit(manga)"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors"
              >
                Sửa
              </button>
              <button
                @click="deleteManga(manga._id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Add Modal - Improved -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          ×
        </button>

        <h2 class="text-2xl font-semibold mb-6 text-gray-800">
          {{ isEditing ? 'Chỉnh sửa Manga' : 'Thêm Manga Mới' }}
        </h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Debug form values -->
          <div class="mb-4 p-3 bg-gray-100 rounded text-sm">
            <strong>Debug Form Values:</strong><br>
            Title: "{{ form.title }}"<br>
            Author: "{{ form.author }}"<br>
            Genre: "{{ form.genre }}"<br>
            Price: {{ form.price }}<br>
            Stock: {{ form.stock }}
          </div>

          <!-- Title and Author -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tiêu đề manga"
                @input="onInputChange('title', $event)"
              />
              <small class="text-gray-500">Current: {{ form.title }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tác giả <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.author"
                type="text"
                required
                class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên tác giả"
                @input="onInputChange('author', $event)"
              />
              <small class="text-gray-500">Current: {{ form.author }}</small>
            </div>
          </div>

          <!-- Genre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
            <input
              v-model="form.genre"
              type="text"
              class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Action, Romance, Comedy"
              @input="onInputChange('genre', $event)"
            />
            <small class="text-gray-500">Current: {{ form.genre }}</small>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Nhập mô tả về manga"
              @input="onInputChange('description', $event)"
            ></textarea>
            <small class="text-gray-500">Current: {{ form.description }}</small>
          </div>

          <!-- Price, Stock, Cover Image -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="1000"
                required
                class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                @input="onInputChange('price', $event)"
              />
              <small class="text-gray-500">Current: {{ form.price }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số lượng <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                @input="onInputChange('stock', $event)"
              />
              <small class="text-gray-500">Current: {{ form.stock }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input
                v-model="form.coverImage"
                type="url"
                class="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
                @input="onInputChange('coverImage', $event)"
              />
              <small class="text-gray-500">Current: {{ form.coverImage }}</small>
            </div>
          </div>

          <!-- Image preview -->
          <div v-if="form.coverImage" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Preview ảnh bìa:</label>
            <img
              :src="form.coverImage"
              alt="Preview"
              class="w-32 h-48 object-cover border rounded-md"
              @error="onImgError"
            />
          </div>

          <!-- Error message -->
          <div v-if="formError" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {{ formError }}
          </div>

          <!-- Action buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const mangas = ref([])
const loading = ref(false)
const errorMsg = ref('')
const submitting = ref(false)
const formError = ref('')
const editingManga = ref(null)
const isAdding = ref(false)

// Form data
const form = ref({
  title: '',
  author: '',
  genre: '',
  description: '',
  price: 0,
  stock: 0,
  coverImage: ''
})

const userStore = useUserStore()

// Computed properties
const showModal = computed(() => editingManga.value !== null || isAdding.value)
const isEditing = computed(() => editingManga.value !== null)

// Placeholder image
const placeholderImage = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150">
  <rect width="100" height="150" fill="#eee"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#999">No Cover</text>
</svg>
`)

// API setup
const baseApi = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
const adminPath = '/admin/mangas'

const api = axios.create({
  baseURL: `${baseApi}${adminPath}`
})

// Add auth token to requests
api.interceptors.request.use(cfg => {
  const token = userStore.token
  if (token) {
    cfg.headers = cfg.headers || {}
    cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

// Reset form to default values
const resetForm = () => {
  form.value = {
    title: '',
    author: '',
    genre: '',
    description: '',
    price: 0,
    stock: 0,
    coverImage: ''
  }
}

// Fetch all mangas
const fetchMangas = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await api.get('')
    mangas.value = res.data || []
    console.log('Fetched mangas:', mangas.value.length)
  } catch (err) {
    console.error('fetchMangas error:', err)
    errorMsg.value = `Không lấy được danh sách manga: ${err.response?.data?.message || err.message}`
  } finally {
    loading.value = false
  }
}

// Open add modal
const openAdd = () => {
  console.log('Opening add modal')
  isAdding.value = true
  editingManga.value = null
  resetForm()
  formError.value = ''
}

// Open edit modal
const openEdit = (manga) => {
  console.log('Opening edit modal for:', manga.title)
  editingManga.value = manga
  isAdding.value = false
  form.value = {
    title: manga.title || '',
    author: manga.author || '',
    genre: manga.genre || '',
    description: manga.description || '',
    price: manga.price ?? 0,
    stock: manga.stock ?? 0,
    coverImage: manga.coverImage || ''
  }
  formError.value = ''
}

// Close modal
const closeModal = () => {
  console.log('Closing modal')
  editingManga.value = null
  isAdding.value = false
  formError.value = ''
  resetForm()
}

// Validate form
const validateForm = () => {
  const errors = []
  
  if (!form.value.title?.trim()) {
    errors.push('Tiêu đề không được để trống')
  }
  
  if (!form.value.author?.trim()) {
    errors.push('Tác giả không được để trống')
  }
  
  if (!form.value.price || form.value.price < 0) {
    errors.push('Giá phải là số dương')
  }
  
  if (!form.value.stock || form.value.stock < 0) {
    errors.push('Số lượng phải là số dương')
  }
  
  if (form.value.coverImage && !isValidUrl(form.value.coverImage)) {
    errors.push('URL ảnh bìa không hợp lệ')
  }
  
  return errors
}

// Check if URL is valid
const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Submit form (add or edit)
const submitForm = async () => {
  // Validate form
  const errors = validateForm()
  if (errors.length > 0) {
    formError.value = errors.join(', ')
    return
  }

  submitting.value = true
  formError.value = ''
  
  // Prepare data
  const mangaData = {
    title: form.value.title.trim(),
    author: form.value.author.trim(),
    genre: form.value.genre?.trim() || '',
    description: form.value.description?.trim() || '',
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    coverImage: form.value.coverImage?.trim() || ''
  }
  
  console.log('Submitting manga data:', mangaData)
  
  try {
    let response
    if (isEditing.value) {
      // Update existing manga
      console.log('Updating manga:', editingManga.value._id)
      response = await api.put(`/${editingManga.value._id}`, mangaData)
    } else {
      // Create new manga
      console.log('Creating new manga')
      response = await api.post('', mangaData)
    }
    
    console.log('API response:', response.data)
    await fetchMangas()
    closeModal()
    
    // Show success message
    const action = isEditing.value ? 'cập nhật' : 'thêm'
    alert(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} manga "${mangaData.title}" thành công!`)
    
  } catch (err) {
    console.error('submitForm error:', err)
    console.error('Error response:', err.response?.data)
    
    const action = isEditing.value ? 'cập nhật' : 'thêm'
    const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
    formError.value = `❌ ${action.charAt(0).toUpperCase() + action.slice(1)} thất bại: ${errorMsg}`
  } finally {
    submitting.value = false
  }
}

// Delete manga
const deleteManga = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa manga này?')) return
  
  try {
    await api.delete(`/${id}`)
    await fetchMangas()
    alert('Xóa manga thành công!')
  } catch (err) {
    console.error('deleteManga error:', err)
    alert(`Xóa thất bại: ${err.response?.data?.message || err.message}`)
  }
}

// Format price for display
const formatPrice = (p) => {
  if (p == null) return '-'
  return new Intl.NumberFormat('vi-VN').format(p)
}

// Handle input changes (for debugging)
const onInputChange = (field, event) => {
  const value = event.target.value
  console.log(`Input change - ${field}:`, value)
  console.log('Form before update:', JSON.stringify(form.value))
  
  // Manual update to ensure reactivity
  form.value[field] = value
  
  console.log('Form after update:', JSON.stringify(form.value))
}

// Handle image load error
const onImgError = (e) => {
  e.target.src = placeholderImage
}

// Initialize on mount
onMounted(() => {
  console.log('AdminMangas mounted, fetching data...')
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
