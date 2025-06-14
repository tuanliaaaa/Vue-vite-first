import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'

const app = createApp(App)

app.use(router) // ⬅️ Gắn Vue Router vào ứng dụng

app.mount('#app') // ⬅️ Mount sau khi dùng router
