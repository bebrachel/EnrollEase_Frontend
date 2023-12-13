<template>
    <div v-if="loggedIn">
        <button @click="logout">logout</button>
        <div>
            <table class="custom-table">
                <thead>
                    <th v-for="column in listColumns" :key="column">{{ column }}</th>
                </thead>
                <tbody v-if="responseData">
                    <tr v-for="applicant in responseData" key="№">
                        <td class="center-align">{{ applicant.data.ФИО }}</td>
                        <td>{{ applicant.data.Оригинал }}</td>
                        <td>{{ applicant.data.Пол }}</td>
                        <td>{{ applicant.data.Состояние }}</td>
                        <td>{{ applicant.data['Дата рождения'].split(' ')[0] }}</td>
                        <td class="center-align">{{ applicant.data['Житель города'] }}</td>
                        <td>{{ applicant.data['Направление\\специальность'] }}</td>
                        <td>{{ applicant.data['Сумма баллов по ИД (все)'] }}</td>
                        <td>{{ applicant.data['Сумма баллов'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <h2 class="orange_text">Добро пожаловать на сайт магистратуры ФИТ НГУ!</h2>
        <img :src="logo_fit" width="200" height="200">
        <br>
        <GoogleLogin :callback="callback" prompt auto-login />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { GoogleLogin, decodeCredential, googleLogout } from 'vue3-google-login';
import logo_fit from '../assets/FIT Logo.svg'
import axios from 'axios'

const loggedIn = ref(false)
const user = ref(null)
const listColumns = ref(["ФИО", "Оригинал", "Пол", "Состояние", "Дата рождения", "Житель города", "Направление\\специальность", "Сумма баллов по ИД", "Сумма баллов"])

function callback(response) {
    loggedIn.value = true
    user.value = decodeCredential(response.credential)
    console.log(response)
}

function logout() {
    googleLogout()
    loggedIn.value = false
}

const responseData = ref(null)

onMounted(() => {
    axios.get('http://89.104.67.184:8080/applicants')
        .then(response => {
            responseData.value = response.data.applicantList;
        })
        .catch(error => {
            console.error(error);
        })
})
</script>
  

<style scoped>
.custom-table {
    border-collapse: collapse;
    width: calc(100% - 40px);
    /* Ширина 100%, отнимаем 40px за счет отступов по 20px с каждой стороны */
    margin: 20px;
    /* Отступы от краев экрана */
}

.custom-table th,
.custom-table td {
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px;
}

.custom-table th {
    background-color: #f2f2f2;
}

.custom-table th:not(:last-child),
.custom-table td:not(:last-child) {
    margin-right: 10px;
}
</style>
