import './assets/base.css'
// Leaflet CSS'ini buraya eklemek, tüm sayfalarda haritanın düzgün görünmesini sağlar
import 'leaflet/dist/leaflet.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Pinia ve Router kurulumu
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')