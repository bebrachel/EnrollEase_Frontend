import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleSignInPlugin from "vue3-google-signin"

const serverUrl = import.meta.env.VITE_API_URL
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const token = ref(null)
const applicantList = ref(null)

createApp(App)
    .use(router)
    .use(GoogleSignInPlugin, {
        clientId: CLIENT_ID,
      })
    .provide("serverUrl", serverUrl)
    .provide("token", token)
    .provide("applicantList", applicantList)
    .mount('#app')