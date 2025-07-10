<template>
  <aside class="sidebar" :class="{ 'mobile-open': isMobileOpen }">
    <div class="sidebar-header">
      <div class="logo">
        <GraduationCap class="logo-icon" />
        <span class="logo-text">EduSystem</span>
      </div>
      <button @click="closeMobileSidebar" class="close-btn md:hidden">
        <X />
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-text">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="logout" class="logout-btn">
        <LogOut class="nav-icon" />
        <span class="nav-text">Logout</span>
      </button>
    </div>
  </aside>

  <div v-if="isMobileOpen" @click="closeMobileSidebar" class="mobile-overlay md:hidden"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  User,
  LogOut,
  Calendar,
  Settings, // ✅ Tambahkan icon Settings
  X
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isMobileOpen = ref(false)

// ✅ Menu lengkap termasuk "Pengaturan"
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Mahasiswa', path: '/students', icon: Users },
  { name: 'Mata Kuliah', path: '/courses', icon: BookOpen },
  { name: 'Profil', path: '/profile', icon: User },
  { name: 'Jadwal Kuliah', path: '/jadwal', icon: Calendar },
  { name: 'Pengaturan', path: '/settings', icon: Settings } // ✅ Tambahan menu
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const closeMobileSidebar = () => {
  isMobileOpen.value = false
}

defineExpose({
  toggleMobile: () => {
    isMobileOpen.value = !isMobileOpen.value
  }
})
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 30;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
  border-left-color: #3b82f6;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  color: #dc2626;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  width: 100%;
}

.logout-btn:hover {
  background: #fee2e2;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 30;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
