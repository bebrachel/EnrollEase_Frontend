import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import router from './router'

const CLIENT_ID = ""
const serverUrl = "http://89.104.67.184:8080/"
const token = ref(null)

createApp(App)
    .use(router)
    .use(vue3GoogleLogin, {
        clientId: CLIENT_ID,
    })
    .provide("serverUrl", serverUrl)
    .provide("token", token)
    .mount('#app')