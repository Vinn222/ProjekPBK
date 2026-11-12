import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeData } from './stores/bootstrap'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
initializeData() // muat seed ke localStorage bila kosong, pulihkan sesi
app.use(router)
app.mount('#app')
