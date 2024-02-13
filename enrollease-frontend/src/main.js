import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import router from './router'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const serverUrl = import.meta.env.VITE_API_URL
const token = ref(null)
const applicantList = ref(null)

createApp(App)
    .use(router)
    .use(vue3GoogleLogin, {
        clientId: CLIENT_ID,
    })
    .provide("serverUrl", serverUrl)
    .provide("token", token)
    .provide("applicantList", applicantList)
    .mount('#app')