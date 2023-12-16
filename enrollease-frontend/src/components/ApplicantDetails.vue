<template>
    <div v-if="applicantList">
        <h1>{{ applicantList[$route.params.number].data.ФИО }}</h1>
        <h2>Статус: {{ applicantList[$route.params.number].status }}</h2>
        <div v-for="(item, key) in applicantList[$route.params.number].data" :key="key">
            <p v-if="key !== '№' && key !== 'ФИО'">
                {{ key }}: {{ item }}
            </p>
        </div>
    </div>
</template>


<script setup>
import { inject } from 'vue'

const applicantList = inject("applicantList")
</script>