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
import { ref, onMounted } from 'vue'
import { fetchWrapper } from '@/helpers/fetch-wrapper'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { api_uri } = storeToRefs(authStore)

const add = ref(false)
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

async function addNewColleague() {
    await fetchWrapper.put(api_uri.value + 'admin/colleagues', newColleagueData.value)
        .then(() => {
            newColleagueData.value.email = ''
            newColleagueData.value.roles[0] = 'DEFAULT_COLLEAGUE'
            getData()
        }).catch(error => {
            console.error(error);
        })
}

function createNotif(type, text) {
    notify({
        group: "app",
        type: type,
        text: text,
    })
}

onMounted(async () => {
    await fetchWrapper.get(api_uri.value + 'colleagues')
        .then(response => {
            responseData.value = response.colleagueList;
        }).catch(error => {
            createNotif("error", "Ошибка загрузки настроек!")
        })
})
</script>
