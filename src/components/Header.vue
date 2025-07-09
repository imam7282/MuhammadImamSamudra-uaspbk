<template>
  <header class="header">
    <div class="header-left">
      <button @click="toggleMobileSidebar" class="mobile-menu-btn md:hidden">
        <Menu />
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    
    <div class="header-right">
      <div class="user-menu">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ currentUser.name }}</span>
          <span class="user-role">{{ currentUser.role }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Menu } from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/students': 'Manajemen Mahasiswa',
    '/courses': 'Manajemen Mata Kuliah',
    '/profile': 'Profil Pengguna'
  }
  return titles[route.path] || 'EduSystem'
})

const userInitials = computed(() => {
  if (!currentUser.value.name) return 'A'
  return currentUser.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const emit = defineEmits(['toggleMobileSidebar'])

const toggleMobileSidebar = () => {
  emit('toggleMobileSidebar')
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background: #f3f4f6;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .user-info {
    display: none;
  }
}
</style>