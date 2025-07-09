import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api-production-d3ee.up.railway.app/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api