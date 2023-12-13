import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'

const CLIENT_ID = ""

createApp(App)
.use(vue3GoogleLogin, {
    clientId: CLIENT_ID,
}).mount('#app')