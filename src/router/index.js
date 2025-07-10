import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Students from '../components/Students.vue'
import Courses from '../components/Courses.vue'
import Profile from '../components/Profile.vue'
import Schedule from '../components/Schedule.vue'
import Settings from '../components/Settings.vue' // ✅ Tambahkan import ini

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/students',
    name: 'Students',
    component: Students
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/jadwal',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings // ✅ Tambahkan route untuk Pengaturan
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
