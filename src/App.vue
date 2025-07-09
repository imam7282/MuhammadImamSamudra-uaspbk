<template>
  <div id="app">
    <div v-if="!isLoggedIn">
      <router-view />
    </div>
    <div v-else class="app-layout">
      <Sidebar />
      <div class="main-content">
        <Header />
        <main class="content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
}
</style>