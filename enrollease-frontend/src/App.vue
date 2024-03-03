<template>
  <div v-if="loggedIn">
    <header>
      <nav id="navigation" class="some">
        <router-link to="/" :class="['navLink', 'logoText']" class="enrollEaseLink">EnrollEase</router-link>
        <div class="navList">
          <router-link to="/portfolio" :class="{ 'active': $route.path === '/portfolio' }"
            class="navLink">Портфолио</router-link>
          <router-link to="/applicants" :class="{ 'active': $route.path === '/applicants' }"
            class="navLink">Абитуриенты</router-link>
          <router-link to="/settings" :class="{ 'active': $route.path === '/settings' }"
            class="navLink">Настройки</router-link>
          <span class="navLink" @click="logout">Выйти</span>
        </div>
      </nav>
    </header>

    <div class="inside">
      <RouterView />
    </div>
  </div>

  <div v-else class="centeredContent">
    <h2>Добро пожаловать на сайт магистратуры ФИТ НГУ!</h2>
    <img :src="logo_fit" width="200" height="200">

    <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>

  </div>

  <notifications group="auth" position="top" classes="my-notification"/>
  <notifications group="app" position="bottom right" classes="my-notification"/>
</template>



<script setup>
import { inject, ref } from 'vue'
import logo_fit from './assets/FIT Logo.svg'
import { GoogleSignInButton } from "vue3-google-signin";

const token = inject("token")
const loggedIn = ref(false)

const handleLoginSuccess = (response) => {
  const { credential } = response
  loggedIn.value = true
  token.value = credential
}

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
}

function logout() {
  loggedIn.value = false
}
</script>



<style scoped>
header {
  background-color: #FF8933;
  color: #010101;
  padding: 15px;
  margin-bottom: 30px;
}

#navigation {
  display: flex;
  justify-content: space-between;
}

.navList {
  margin-top: 10px;
}

.navLink {
  color: white;
  text-decoration: none;
  margin-right: 50px;
  cursor: pointer;
}

.logoText {
  font-size: xx-large;
  font-weight: bold;
  font-style: italic;
  margin-left: 10px;
}

.inside {
  margin-left: 50px;
}

.centeredContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* Высота 100% видимой области страницы */
}

.active {
  color: black;
  text-decoration: underline;
}
</style>