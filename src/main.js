import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'      // ✅ Tambahkan ini
import './style.css'

const app = createApp(App)
const pinia = createPinia()              // ✅ Buat instance pinia
app.use(pinia)                           // ✅ Sambungkan ke app
app.use(router)
app.mount('#app')
