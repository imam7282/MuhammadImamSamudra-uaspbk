<template>
  <div class="courses">
    <div class="courses-header">
      <div>
        <h1>Manajemen Mata Kuliah</h1>
        <p>Kelola mata kuliah dan informasi pengajar</p>
      </div>
      <button @click="showAddModal = true" class="add-btn">
        <Plus />
        Tambah Mata Kuliah
      </button>
    </div>
    
    <div class="courses-filters">
      <div class="search-box">
        <Search class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari mata kuliah..."
          class="search-input"
        />
      </div>
      
      <select v-model="selectedSemester" class="filter-select">
        <option value="">Semua Semester</option>
        <option value="Ganjil">Ganjil</option>
        <option value="Genap">Genap</option>
      </select>
    </div>
    
    <!-- Loading State -->
    <div v-if="coursesStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat data mata kuliah...</p>
    </div>
    
    <!-- Error State -->
    <div v-if="coursesStore.error" class="error-container">
      <p class="error-message">{{ coursesStore.error }}</p>
      <button @click="coursesStore.fetchCourses()" class="retry-btn">
        Coba Lagi
      </button>
    </div>
    
    <div class="courses-grid">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
      >
        <div class="course-header">
          <div class="course-code">
            {{ course.code }}
          </div>
          <div class="course-actions">
            <button @click="editCourse(course)" class="action-btn edit">
              <Edit2 />
            </button>
            <button @click="deleteCourse(course.id)" class="action-btn delete">
              <Trash2 />
            </button>
          </div>
        </div>
        
        <div class="course-content">
          <h3 class="course-title">{{ course.name }}</h3>
          <p class="course-instructor">{{ course.instructor }}</p>
          <p class="course-description">{{ course.description }}</p>
        </div>
        
        <div class="course-details">
          <div class="detail-row">
            <span class="detail-label">SKS:</span>
            <span class="detail-value">{{ course.credits }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Semester:</span>
            <span class="detail-value">{{ course.semester }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Kapasitas:</span>
            <span class="detail-value">{{ course.capacity }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Terdaftar:</span>
            <span class="detail-value">{{ course.enrolled }}</span>
          </div>
        </div>
        
        <div class="course-footer">
          <div class="enrollment-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${(course.enrolled / course.capacity) * 100}%` }"
              ></div>
            </div>
            <span class="progress-text">
              {{ Math.round((course.enrolled / course.capacity) * 100) }}% penuh
            </span>
          </div>
          <span class="status-badge" :class="course.status.toLowerCase()">
            {{ course.status }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Tambah' : 'Edit' }} Mata Kuliah</h3>
          <button @click="closeModal" class="close-btn">
            <X />
          </button>
        </div>
        
        <form @submit.prevent="saveCourse" class="modal-form">
          <div class="form-group">
            <label>Kode Mata Kuliah</label>
            <input v-model="form.code" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Nama Mata Kuliah</label>
            <input v-model="form.name" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="form.description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Pengajar</label>
            <input v-model="form.instructor" type="text" required />
          </div>
          
          <div class="form-group">
            <label>SKS</label>
            <input v-model.number="form.credits" type="number" min="1" max="6" required />
          </div>
          
          <div class="form-group">
            <label>Semester</label>
            <select v-model="form.semester" required>
              <option value="">Pilih Semester</option>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Kapasitas</label>
            <input v-model.number="form.capacity" type="number" min="1" required />
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
import { useCoursesStore } from '../stores/courses'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X 
} from 'lucide-vue-next'

const coursesStore = useCoursesStore()

// Initialize data on component mount
onMounted(() => {
  coursesStore.fetchCourses()
})

const searchQuery = ref('')
const selectedSemester = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCourse = ref(null)

const form = reactive({
  code: '',
  name: '',
  description: '',
  instructor: '',
  credits: 1,
  semester: '',
  capacity: 30
})

// Use API-based filtering instead of client-side filtering
const filteredCourses = computed(() => coursesStore.courses)

const resetForm = () => {
  Object.assign(form, {
    code: '',
    name: '',
    description: '',
    instructor: '',
    credits: 1,
    semester: '',
    capacity: 30
  })
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCourse.value = null
  resetForm()
}

const editCourse = (course) => {
  editingCourse.value = course
  Object.assign(form, course)
  showEditModal.value = true
}

const saveCourse = async () => {
  try {
    if (showAddModal.value) {
      await coursesStore.addCourse(form)
    } else {
      await coursesStore.updateCourse(editingCourse.value.id, form)
    }
    closeModal()
  } catch (error) {
    // Error is already handled in the store
    console.error('Failed to save course:', error)
  }
}

const deleteCourse = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
    try {
      await coursesStore.deleteCourse(id)
    } catch (error) {
      // Error is already handled in the store
      console.error('Failed to delete course:', error)
    }
  }
}

// Handle search with API
const handleSearch = async () => {
  if (showAddModal.value) {
    await coursesStore.searchCourses(searchQuery.value)
  } else {
    await coursesStore.fetchCourses()
  }
}

// Handle semester filter with API
const handleSemesterFilter = async () => {
  if (selectedSemester.value) {
    await coursesStore.filterBySemester(selectedSemester.value)
  } else {
    await coursesStore.fetchCourses()
  }
}

// Watch for search and filter changes
import { watch } from 'vue'

watch(searchQuery, () => {
  handleSearch()
})

watch(selectedSemester, () => {
  handleSemesterFilter()
})
</script>

<style scoped>
.courses {
  max-width: 1200px;
  margin: 0 auto;
}

.courses-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.courses-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.courses-header p {
  color: #6b7280;
  font-size: 1.125rem;
}

.add-btn {
  background: #10b981;
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
  background: #059669;
}

.courses-filters {
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  border-color: #10b981;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.course-code {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.course-actions {
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

.course-content {
  margin-bottom: 1.5rem;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.course-instructor {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.course-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.course-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.enrollment-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group textarea {
  resize: vertical;
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
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #059669;
}

@media (max-width: 768px) {
  .courses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .courses-filters {
    flex-direction: column;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-details {
    grid-template-columns: 1fr;
  }
}
</style>