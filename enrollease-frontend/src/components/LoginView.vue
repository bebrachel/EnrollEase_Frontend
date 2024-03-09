<template>
    <h2>Добро пожаловать на сайт магистратуры ФИТ НГУ!</h2>
    <img :src="logo_fit" width="200" height="200">

    <button @click="signInWithGoogle">Continue with google</button>
</template>



<script setup>
import logo_fit from '@/assets/FIT Logo.svg'
import { googleSdkLoaded } from 'vue3-google-login'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { clientId, redirect_uri } = storeToRefs(authStore)

const signInWithGoogle = () => {
    googleSdkLoaded(google => {
        google.accounts.oauth2
            .initCodeClient({
                client_id: clientId.value,
                scope: 'email profile openid',
                redirect_uri: redirect_uri.value,
                callback: response => {
                    if (response.code) {
                        authStore.login(response.code)
                    }
                },
            })
            .requestCode()
    })
}
</script>