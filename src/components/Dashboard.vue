<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>📊 EduSystem Dashboard</h1>
      <p class="subtext">Pantau data mahasiswa dan mata kuliah secara real-time</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card bg-blue">
        <div class="icon-circle">
          <Users />
        </div>
        <div>
          <p class="label">Total Mahasiswa</p>
          <h2>{{ totalStudents }}</h2>
        </div>
      </div>

      <div class="stat-card bg-green">
        <div class="icon-circle">
          <BookOpen />
        </div>
        <div>
          <p class="label">Total Mata Kuliah</p>
          <h2>{{ totalCourses }}</h2>
        </div>
      </div>

      <div class="stat-card bg-orange">
        <div class="icon-circle">
          <TrendingUp />
        </div>
        <div>
          <p class="label">Rata-rata IPK</p>
          <h2>{{ averageGPA }}</h2>
        </div>
      </div>

      <div class="stat-card bg-purple">
        <div class="icon-circle">
          <UserCheck />
        </div>
        <div>
          <p class="label">Total Pendaftar</p>
          <h2>{{ totalEnrolled }}</h2>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="chart-section">
        <div class="chart-card">
          <h3>🎓 Distribusi Mahasiswa per Jurusan</h3>
          <canvas ref="studentChart"></canvas>
        </div>
        <div class="chart-card">
          <h3>📈 Trend Pendaftaran Mata Kuliah</h3>
          <canvas ref="courseChart"></canvas>
        </div>
      </div>

      <div class="recent-section">
        <div class="recent-card">
          <h3>🆕 Mahasiswa Terbaru</h3>
          <div v-for="student in recentStudents" :key="student.id" class="recent-item">
            <div class="avatar">{{ getInitials(student.name) }}</div>
            <div class="recent-info">
              <p class="name">{{ student.name }}</p>
              <p class="details">{{ student.major }} - {{ student.nim }}</p>
            </div>
            <span class="badge success">{{ student.status }}</span>
          </div>
        </div>

        <div class="recent-card">
          <h3>🔥 Mata Kuliah Populer</h3>
          <div v-for="course in popularCourses" :key="course.id" class="recent-item">
            <div class="avatar course">{{ course.code }}</div>
            <div class="recent-info">
              <p class="name">{{ course.name }}</p>
              <p class="details">{{ course.instructor }}</p>
            </div>
            <span class="badge info">{{ course.enrolled }}/{{ course.capacity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useCoursesStore } from '../stores/courses'
import { Users, BookOpen, TrendingUp, UserCheck } from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()

onMounted(async () => {
  await Promise.all([
    studentsStore.fetchStudents(),
    coursesStore.fetchCourses()
  ])
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
  coursesStore.courses.sort((a, b) => b.enrolled - a.enrolled).slice(0, 4)
)

const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const initializeCharts = () => {
  if (!studentChart.value || !courseChart.value) return

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
  padding: 2rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtext {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon-circle {
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card h2 {
  font-size: 1.75rem;
  margin: 0;
}

.label {
  font-size: 0.875rem;
  opacity: 0.85;
}

.bg-blue { background: #3b82f6; }
.bg-green { background: #10b981; }
.bg-orange { background: #f59e0b; }
.bg-purple { background: #8b5cf6; }

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.chart-card {
  background: #fff;
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.chart-card h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-card canvas {
  height: 220px !important;
}

.recent-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recent-card {
  background: white;
  padding: 1.25rem;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.recent-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar.course {
  background: #10b981;
  font-size: 0.7rem;
}

.recent-info {
  flex: 1;
}

.name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
}

.details {
  font-size: 0.75rem;
  color: #6b7280;
}

.badge {
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  border-radius: 999px;
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
</style>
