<template>
    <table class="custom-table">
        <thead>
            <th v-for="column in listColumns" :key="column">{{ column }}</th>
        </thead>
        <tbody>
            <tr v-for="applicant in responseData" key="№">
                <td>{{ applicant.email }}</td>
                <td>{{ roleNames[applicant.roles[0].name] }}</td>
            </tr>
        </tbody>
    </table>

    <div>
        <button class="element" @click="() => { add = !add }">Пригласить</button>
        <form v-if="add" @submit.prevent="addNewColleague">
            <div class="element">
                <label for="email">Почта:</label>
                <input id="email" type="text" v-model="newColleagueData.email">
            </div>
            <div class="element">
                <label for="selectRole">Выберите роль:</label>
                <select id="selectRole" v-model="newColleagueData.roles[0]">
                    <option v-for="(value, key) in roleNames" :key="key" :value="key">{{ value }}</option>
                </select>
            </div>
            <button type="submit" class="element">Добавить</button>
        </form>
    </div>
</template>



<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'

const add = ref(false)
const serverUrl = inject("serverUrl")
const token = inject("token")
const responseData = ref(null)
const newColleagueData = ref({
    email: '',
    roles: ['DEFAULT_COLLEAGUE']
});
const listColumns = ref(["Почта", "Роль"])
const roleNames = ref({
    'HEAD_OF_COMMISSION': 'Глава комиссии',
    'DEFAULT_COLLEAGUE': 'Член комиссии'
})

function addNewColleague() {
    axios.put(serverUrl + 'admin/colleagues', newColleagueData.value, {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then(() => {
        newColleagueData.value.email = ''
        newColleagueData.value.roles[0] = 'DEFAULT_COLLEAGUE'
        getData()
    }).catch(error => {
        console.error(error);
    })
}

onMounted(() => {
    getData()
})

function getData() {
    axios.get(serverUrl + 'colleagues', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then(response => {
        responseData.value = response.data.colleagueList;
    }).catch(error => {
        console.error(error);
    })
}
</script>
