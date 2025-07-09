import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import components
import Dashboard from './components/Dashboard.vue'
import Students from './components/Students.vue'
import Courses from './components/Courses.vue'
import Login from './components/Login.vue'
import Profile from './components/Profile.vue'

// Define routes
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } },
  { path: '/students', component: Students, name: 'students', meta: { requiresAuth: true } },
  { path: '/courses', component: Courses, name: 'courses', meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, name: 'profile', meta: { requiresAuth: true } }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

// Create app
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')