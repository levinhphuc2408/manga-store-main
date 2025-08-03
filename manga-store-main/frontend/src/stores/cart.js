import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { mangaId, title, price, quantity }

  function addToCart(manga) {
    const existing = items.value.find(item => item.mangaId === manga.mangaId)
    if (existing) {
      existing.quantity += manga.quantity
    } else {
      items.value.push({ ...manga })
    }
  }

  function removeFromCart(mangaId) {
    items.value = items.value.filter(item => item.mangaId !== mangaId)
  }

  function updateQuantity(mangaId, quantity) {
    const item = items.value.find(item => item.mangaId === mangaId)
    if (item) {
      item.quantity = quantity > 0 ? quantity : 1
    }
  }

  // Hàm mới bạn cần thêm vào
  function clearCart() {
    items.value = []
  }

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const totalQuantity = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,      // nhớ export hàm này
    totalPrice,
    totalQuantity,
  }
})
