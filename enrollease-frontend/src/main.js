import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

const serverUrl = import.meta.env.VITE_API_URL
const token = ref(null)
const applicantList = ref(null)

createApp(App)
    .use(router)
    .provide("serverUrl", serverUrl)
    .provide("token", token)
    .provide("applicantList", applicantList)
    .mount('#app')