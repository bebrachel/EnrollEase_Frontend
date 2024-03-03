import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleSignInPlugin from "vue3-google-signin"
import Notifications from '@kyvg/vue3-notification'
import Swal from 'sweetalert2'

const serverUrl = import.meta.env.VITE_API_URL
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
//const serverUrl = process.env.URL
//const CLIENT_ID = process.env.CLIENT_ID
const token = ref(null)
const applicantList = ref(null)

createApp(App)
    .use(router)
    .use(GoogleSignInPlugin, {
        clientId: CLIENT_ID,
      })
    .use(Notifications)
    .provide("serverUrl", serverUrl)
    .provide("token", token)
    .provide("applicantList", applicantList)
    .mount('#app')