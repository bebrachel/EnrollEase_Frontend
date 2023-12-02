<template>
  <div v-if="loggedIn">
    <button @click="logout">logout</button>
    <h1>Hello, {{ user.name }}</h1>
    <img :src="user.picture">
    <h2>The name is: {{ user.name }}</h2>
    <h2>The email is: {{ user.email }}</h2>
  </div>
  <div v-else>
    <h2 class="orange_text">Добро пожаловать на сайт магистратуры ФИТ НГУ!</h2>
    <img :src="logo_fit" width="200" height="200">
    <br>
    <GoogleLogin :callback="callback" prompt auto-login />
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { GoogleLogin, decodeCredential, googleLogout } from 'vue3-google-login';
import logo_fit from './assets/FIT Logo.svg'
//import HelloWorld from './components/HelloWorld.vue'

const loggedIn = ref(false)
const user = ref(null)

function callback(response) {
  loggedIn.value = true
  user.value = decodeCredential(response.credential)
  console.log(response)
}

function logout() {
  googleLogout()
  loggedIn.value = false
}
</script>


<style scoped></style>
