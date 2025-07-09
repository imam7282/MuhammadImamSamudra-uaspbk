import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
  
  const login = (username, password) => {
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      const userData = {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        email: 'admin@university.edu',
        role: 'Administrator'
      }
      
      isAuthenticated.value = true
      user.value = userData
      
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      
      return true
    }
    return false
  }
  
  const logout = () => {
    isAuthenticated.value = false
    user.value = {}
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }
  
  const isLoggedIn = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value)
  
  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoggedIn,
    currentUser
  }
})