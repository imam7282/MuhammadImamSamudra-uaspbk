<template>
  <div class="students">
    <div class="students-header">
      <div>
        <h1>Manajemen Mahasiswa</h1>
        <p>Kelola data mahasiswa dan informasi akademik</p>
      </div>
      <button @click="showAddModal = true" class="add-btn">
        <Plus />
        Tambah Mahasiswa
      </button>
    </div>
    
    <div class="students-filters">
      <div class="search-box">
        <Search class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari mahasiswa..."
          class="search-input"
        />
      </div>
      
      <select v-model="selectedMajor" class="filter-select">
        <option value="">Semua Jurusan</option>
        <option value="Teknik Informatika">Teknik Informatika</option>
        <option value="Sistem Informasi">Sistem Informasi</option>
      </select>
    </div>
    
    <!-- Loading State -->
    <div v-if="studentsStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat data mahasiswa...</p>
    </div>
    
    <!-- Error State -->
    <div v-if="studentsStore.error" class="error-container">
      <p class="error-message">{{ studentsStore.error }}</p>
      <button @click="studentsStore.fetchStudents()" class="retry-btn">
        Coba Lagi
      </button>
    </div>
    
    <div class="students-grid">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="student-card"
      >
        <div class="student-header">
          <div class="student-avatar">
            {{ getInitials(student.name) }}
          </div>
          <div class="student-info">
            <h3>{{ student.name }}</h3>
            <p class="student-nim">{{ student.nim }}</p>
          </div>
          <div class="student-actions">
            <button @click="editStudent(student)" class="action-btn edit">
              <Edit2 />
            </button>
            <button @click="deleteStudent(student.id)" class="action-btn delete">
              <Trash2 />
            </button>
          </div>
        </div>
        
        <div class="student-details">
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ student.email }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Jurusan:</span>
            <span class="detail-value">{{ student.major }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Semester:</span>
            <span class="detail-value">{{ student.semester }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">IPK:</span>
            <span class="detail-value font-semibold" :class="getGPAClass(student.gpa)">
              {{ student.gpa }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mata Kuliah:</span>
            <span class="detail-value">{{ student.enrolledCourses }} mata kuliah</span>
          </div>
        </div>
        
        <div class="student-footer">
          <span class="status-badge" :class="student.status.toLowerCase()">
            {{ student.status }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Tambah' : 'Edit' }} Mahasiswa</h3>
          <button @click="closeModal" class="close-btn">
            <X />
          </button>
        </div>
        
        <form @submit.prevent="saveStudent" class="modal-form">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input v-model="form.name" type="text" required />
          </div>
          
          <div class="form-group">
            <label>NIM</label>
            <input v-model="form.nim" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label>Jurusan</label>
            <select v-model="form.major" required>
              <option value="">Pilih Jurusan</option>
              <option value="Teknik Informatika">Teknik Informatika</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Semester</label>
            <input v-model.number="form.semester" type="number" min="1" max="14" required />
          </div>
          
          <div class="form-group">
            <label>IPK</label>
            <input v-model.number="form.gpa" type="number" min="0" max="4" step="0.01" required />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Batal
            </button>
            <button type="submit" class="btn-primary">
              {{ showAddModal ? 'Tambah' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { useStudentsStore } from '../stores/students'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X 
} from 'lucide-vue-next'

const studentsStore = useStudentsStore()

// Initialize data on component mount
onMounted(() => {
  studentsStore.fetchStudents()
})

const searchQuery = ref('')
const selectedMajor = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingStudent = ref(null)

const form = reactive({
  name: '',
  nim: '',
  email: '',
  major: '',
  semester: 1,
  gpa: 0
})

// Use API-based filtering instead of client-side filtering
const filteredStudents = computed(() => studentsStore.students)

const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const getGPAClass = (gpa) => {
  if (gpa >= 3.5) return 'text-green-600'
  if (gpa >= 3.0) return 'text-yellow-600'
  return 'text-red-600'
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    nim: '',
    email: '',
    major: '',
    semester: 1,
    gpa: 0
  })
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingStudent.value = null
  resetForm()
}

const editStudent = (student) => {
  editingStudent.value = student
  Object.assign(form, student)
  showEditModal.value = true
}

const saveStudent = async () => {
  try {
    if (showAddModal.value) {
      await studentsStore.addStudent(form)
    } else {
      await studentsStore.updateStudent(editingStudent.value.id, form)
    }
    closeModal()
  } catch (error) {
    // Error is already handled in the store
    console.error('Failed to save student:', error)
  }
}

const deleteStudent = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
    try {
      await studentsStore.deleteStudent(id)
    } catch (error) {
      // Error is already handled in the store
      console.error('Failed to delete student:', error)
    }
  }
}

// Handle search with API
const handleSearch = async () => {
  if (showAddModal.value) {
    await studentsStore.searchStudents(searchQuery.value)
  } else {
    await studentsStore.fetchStudents()
  }
}

// Handle major filter with API
const handleMajorFilter = async () => {
  if (selectedMajor.value) {
    await studentsStore.filterByMajor(selectedMajor.value)
  } else {
    await studentsStore.fetchStudents()
  }
}

// Watch for search and filter changes
import { watch } from 'vue'

watch(searchQuery, () => {
  handleSearch()
})

watch(selectedMajor, () => {
  handleMajorFilter()
})
</script>

<style scoped>
.students {
  max-width: 1200px;
  margin: 0 auto;
}

.students-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.students-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.students-header p {
  color: #6b7280;
  font-size: 1.125rem;
}

.add-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

.students-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 1.25rem;
  height: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.student-avatar {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.student-info {
  flex: 1;
}

.student-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.student-nim {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.student-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.action-btn.edit {
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #eff6ff;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fef2f2;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.student-footer {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.modal-form {
  padding: 0 1.5rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.text-green-600 {
  color: #059669;
}

.text-yellow-600 {
  color: #d97706;
}

.text-red-600 {
  color: #dc2626;
}

.font-semibold {
  font-weight: 600;
}

@media (max-width: 768px) {
  .students-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .students-filters {
    flex-direction: column;
  }
  
  .students-grid {
    grid-template-columns: 1fr;
  }
}
</style>