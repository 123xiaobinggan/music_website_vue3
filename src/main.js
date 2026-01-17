import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

// 1️⃣ 创建 pinia 实例
const pinia = createPinia()

// 2️⃣ 在实例上 use 插件
pinia.use(piniaPluginPersistedstate)

// 3️⃣ 挂载 pinia 和 router
app.use(pinia)
app.use(router)

app.mount('#app')
