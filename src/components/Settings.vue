<template>
  <div class="settings-page">
    <h1>⚙️ Pengaturan</h1>
    <p>Halaman ini berisi pengaturan akun atau preferensi aplikasi Anda.</p>

    <div class="setting-option">
      <label>
        <input type="checkbox" v-model="darkMode" />
        Aktifkan mode gelap
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// State untuk checkbox mode gelap
const darkMode = ref(false)

// Perhatikan perubahan dan ubah class pada <html>
watch(darkMode, (enabled) => {
  if (enabled) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.setting-option {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #374151;
}
</style>
