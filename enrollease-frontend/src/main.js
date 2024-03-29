import './style.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import { router } from './helpers/router'

import Notifications from '@kyvg/vue3-notification'
import { createPinia } from 'pinia'


const applicantList = ref(null)

createApp(App)
  .use(router)
  .use(Notifications)
  .use(createPinia())
  .provide("applicantList", applicantList)
  .mount('#app')