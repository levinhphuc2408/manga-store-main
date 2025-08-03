import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)

  async function loadFromLocalStorage() {
  const t = localStorage.getItem('token')
  const u = localStorage.getItem('user')
  if (t) token.value = t
  if (u) user.value = JSON.parse(u)
}

  function setUser(data) {
    user.value = data
    if (data) {
      localStorage.setItem('user', JSON.stringify(data))
    } else {
      localStorage.removeItem('user')
    }
  }

  function setToken(t) {
    token.value = t
    if (t) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }
  }

  function loadFromLocalStorage() {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) token.value = t
    if (u) user.value = JSON.parse(u)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, isLoggedIn, setUser, setToken, loadFromLocalStorage, logout }
})
