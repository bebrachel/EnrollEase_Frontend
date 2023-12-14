<template>
  <header>
      <nav id="navigation" class="some">
        <router-link to="/applicants" class="navLink">Абитуриенты</router-link>
        <router-link to="/settings" class="navLink">Настройки</router-link>
        <button @click="logout">Выйти</button>
      </nav>
  </header>
  <div v-if="loggedIn">
    <RouterView />
  </div>
  <div v-else>
    <h2 class="orange_text">Добро пожаловать на сайт магистратуры ФИТ НГУ!</h2>
    <img :src="logo_fit" width="200" height="200">
    <br>
    <GoogleLogin :callback="callback" prompt auto-login />
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { GoogleLogin, googleLogout } from 'vue3-google-login';
import logo_fit from './assets/FIT Logo.svg'

const token = inject("token")
const loggedIn = ref(false)

function callback(response) {
  loggedIn.value = true
  token.value = response.credential
  console.log(response)
}

function logout() {
    googleLogout()
    loggedIn.value = false
}
</script>



<style scoped>
.navLink {
  margin-right: 100px;
  color: white;
  text-decoration: none;
}
</style>