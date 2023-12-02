<template>
    <div v-if="loggedIn">
        <button @click="logout">logout</button>
        <button @click="getData">Get Data</button>
        <p v-if="responseData">Data: {{ responseData }}</p>
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
import logo_fit from '../assets/FIT Logo.svg'
import axios from 'axios'

const loggedIn = ref(false)
const user = ref(null)

function callback(response) {
    loggedIn.value = true
    user.value = decodeCredential(response.credential)
}

function logout() {
    googleLogout()
    loggedIn.value = false
}

const responseData = ref(null)

function getData() {
    axios.get('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => {
            responseData.value = response.data;
        })
        .catch(error => {
            console.error(error);
        })
}
</script>
  