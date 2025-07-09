<template>
  <div class="profile">
    <div class="profile-header">
      <h1>Profil Pengguna</h1>
      <p>Kelola informasi akun dan pengaturan</p>
    </div>
    
    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            {{ userInitials }}
          </div>
          <div class="profile-info">
            <h2>{{ currentUser.name }}</h2>
            <p>{{ currentUser.role }}</p>
          </div>
        </div>
        
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-section">
            <h3>Informasi Pribadi</h3>
            
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input v-model="form.name" type="text" required />
            </div>
            
            <div class="form-group">
              <label>Username</label>
              <input v-model="form.username" type="text" required />
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" required />
            </div>
            
            <div class="form-group">
              <label>Role</label>
              <input v-model="form.role" type="text" disabled />
            </div>
          </div>
          
          <div class="form-section">
            <h3>Keamanan</h3>
            
            <div class="form-group">
              <label>Password Lama</label>
              <input v-model="form.currentPassword" type="password" />
            </div>
            
            <div class="form-group">
              <label>Password Baru</label>
              <input v-model="form.newPassword" type="password" />
            </div>
            
            <div class="form-group">
              <label>Konfirmasi Password Baru</label>
              <input v-model="form.confirmPassword" type="password" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              Simpan Perubahan
            </button>
            <button type="button" @click="resetForm" class="btn-secondary">
              Reset
            </button>
          </div>
        </form>
      </div>
      
      <div class="settings-card">
        <h3>Pengaturan Sistem</h3>
        
        <div class="settings-section">
          <h4>Notifikasi</h4>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.emailNotifications" />
              <span>Email Notifikasi</span>
            </label>
            <p class="setting-description">Terima notifikasi melalui email</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.pushNotifications" />
              <span>Push Notifikasi</span>
            </label>
            <p class="setting-description">Terima notifikasi push di browser</p>
          </div>
        </div>
        
        <div class="settings-section">
          <h4>Tampilan</h4>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.darkMode" />
              <span>Mode Gelap</span>
            </label>
            <p class="setting-description">Gunakan tema gelap</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.compactMode" />
              <span>Mode Kompak</span>
            </label>
            <p class="setting-description">Tampilan lebih ringkas</p>
          </div>
        </div>
        
        <div class="settings-actions">
          <button @click="saveSettings" class="btn-primary">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const userInitials = computed(() => {
  if (!currentUser.value.name) return 'A'
  return currentUser.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const form = reactive({
  name: currentUser.value.name || '',
  username: currentUser.value.username || '',
  email: currentUser.value.email || '',
  role: currentUser.value.role || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const settings = reactive({
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false,
  compactMode: false
})

const resetForm = () => {
  form.name = currentUser.value.name || ''
  form.username = currentUser.value.username || ''
  form.email = currentUser.value.email || ''
  form.role = currentUser.value.role || ''
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}

const updateProfile = () => {
  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    alert('Password baru dan konfirmasi password tidak cocok!')
    return
  }
  
  // Mock update - in real app this would call an API
  const updatedUser = {
    ...currentUser.value,
    name: form.name,
    username: form.username,
    email: form.email
  }
  
  authStore.user = updatedUser
  localStorage.setItem('user', JSON.stringify(updatedUser))
  
  alert('Profil berhasil diupdate!')
  
  // Clear password fields
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}

const saveSettings = () => {
  // Mock save - in real app this would call an API
  localStorage.setItem('userSettings', JSON.stringify(settings))
  alert('Pengaturan berhasil disimpan!')
}

// Load settings from localStorage
const savedSettings = localStorage.getItem('userSettings')
if (savedSettings) {
  Object.assign(settings, JSON.parse(savedSettings))
}
</script>

<style scoped>
.profile {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #6b7280;
  font-size: 1.125rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.profile-card,
.settings-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.profile-avatar {
  width: 4rem;
  height: 4rem;
  background: #8b5cf6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.profile-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.profile-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-group input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.settings-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.setting-label input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #8b5cf6;
}

.setting-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 2rem;
  margin-top: 0.25rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #8b5cf6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #7c3aed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .settings-actions {
    justify-content: stretch;
  }
}
</style>