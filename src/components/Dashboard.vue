<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Selamat datang di Sistem Manajemen Mahasiswa</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon students">
          <Users />
        </div>
        <div class="stat-content">
          <h3>Total Mahasiswa</h3>
          <p class="stat-number">{{ totalStudents }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon courses">
          <BookOpen />
        </div>
        <div class="stat-content">
          <h3>Total Mata Kuliah</h3>
          <p class="stat-number">{{ totalCourses }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon gpa">
          <TrendingUp />
        </div>
        <div class="stat-content">
          <h3>Rata-rata IPK</h3>
          <p class="stat-number">{{ averageGPA }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon enrolled">
          <UserCheck />
        </div>
        <div class="stat-content">
          <h3>Total Pendaftar</h3>
          <p class="stat-number">{{ totalEnrolled }}</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="chart-section">
        <div class="chart-card">
          <h3>Distribusi Mahasiswa per Jurusan</h3>
          <canvas ref="studentChart"></canvas>
        </div>
        
        <div class="chart-card">
          <h3>Trend Pendaftaran Mata Kuliah</h3>
          <canvas ref="courseChart"></canvas>
        </div>
      </div>
      
      <div class="recent-section">
        <div class="recent-card">
          <h3>Mahasiswa Terbaru</h3>
          <div class="recent-list">
            <div
              v-for="student in recentStudents"
              :key="student.id"
              class="recent-item"
            >
              <div class="recent-avatar">
                {{ getInitials(student.name) }}
              </div>
              <div class="recent-info">
                <p class="recent-name">{{ student.name }}</p>
                <p class="recent-detail">{{ student.major }} - {{ student.nim }}</p>
              </div>
              <div class="recent-badge">
                <span class="badge success">{{ student.status }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="recent-card">
          <h3>Mata Kuliah Populer</h3>
          <div class="recent-list">
            <div
              v-for="course in popularCourses"
              :key="course.id"
              class="recent-item"
            >
              <div class="recent-avatar course-avatar">
                {{ course.code }}
              </div>
              <div class="recent-info">
                <p class="recent-name">{{ course.name }}</p>
                <p class="recent-detail">{{ course.instructor }}</p>
              </div>
              <div class="recent-badge">
                <span class="badge info">{{ course.enrolled }}/{{ course.capacity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useCoursesStore } from '../stores/courses'
import { Users, BookOpen, TrendingUp, UserCheck } from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()

// Initialize data on component mount
onMounted(async () => {
  await Promise.all([
    studentsStore.fetchStudents(),
    coursesStore.fetchCourses()
  ])
  
  // Initialize charts after data is loaded
  initializeCharts()
})

const studentChart = ref(null)
const courseChart = ref(null)

const totalStudents = computed(() => studentsStore.totalStudents)
const totalCourses = computed(() => coursesStore.totalCourses)
const averageGPA = computed(() => studentsStore.averageGPA)
const totalEnrolled = computed(() => coursesStore.totalEnrolled)

const recentStudents = computed(() => studentsStore.students.slice(0, 4))
const popularCourses = computed(() => 
  coursesStore.courses
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 4)
)

const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const initializeCharts = () => {
  if (!studentChart.value || !courseChart.value) return
  
  // Student distribution chart
  const studentCtx = studentChart.value.getContext('2d')
  new Chart(studentCtx, {
    type: 'doughnut',
    data: {
      labels: ['Teknik Informatika', 'Sistem Informasi', 'Lainnya'],
      datasets: [{
        data: [60, 30, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  // Course enrollment chart
  const courseCtx = courseChart.value.getContext('2d')
  new Chart(courseCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Pendaftar',
        data: [120, 150, 180, 200, 170, 220],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #6b7280;
  font-size: 1.125rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.students {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-icon.courses {
  background: linear-gradient(135deg, #10b981, #047857);
}

.stat-icon.gpa {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon.enrolled {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.chart-card canvas {
  height: 200px !important;
}

.recent-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recent-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.recent-item:hover {
  background: #f9fafb;
}

.recent-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
}

.recent-avatar.course-avatar {
  background: #10b981;
  font-size: 0.625rem;
}

.recent-info {
  flex: 1;
}

.recent-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.recent-detail {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

.recent-badge {
  display: flex;
  align-items: center;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.success {
  background: #dcfce7;
  color: #166534;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-section {
    gap: 1rem;
  }
  
  .recent-section {
    gap: 1rem;
  }
}
</style>