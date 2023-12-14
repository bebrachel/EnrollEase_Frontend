<template>
    <div>
        <div class="addField">
            <p>Пригласить</p>
            <label for="email" class="addLabel">Почта:</label>
            <input id="email" type="text" class="addInput" v-model="newColleagueData.email">
            <label for="selectRole" class="addLabel">Выберите роль:</label>
            <div class="addInput">
                <select id="selectRole" v-model="newColleagueData.roles[0]">
                    <option value="">Член комиссии</option>
                    <option value="descending">Глава комиссии</option>
                </select>
            </div>
            <button @click="addNewColleague">Добавить</button>
        </div>


        <p>{{ newColleagueData.roles }}</p>


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
    </div>
</template>



<script setup>
import { inject, onMounted, reactive, ref } from 'vue'
import axios from 'axios'

const serverUrl = inject("serverUrl")
const token = inject("token")
const responseData = ref(null)
const newColleagueData = reactive({
    "email": '',
    "roles": ["DEFAULT_COLLEAGUE"]
})
const listColumns = ref(["Почта", "Роль"])
const roleNames = ref({
    'HEAD_OF_COMMISSION': 'Глава комиссии',
    'DEFAULT_COLLEAGUE': 'Член комиссии'
})

function addNewColleague() {
    console.log(newColleagueData)
    axios.put(serverUrl + 'admin/colleagues', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        },
        params: newColleagueData
    }).then(response => {
        console.log(response)
    }).catch(error => {
        console.error(error);
    })
}

onMounted(() => {
    axios.get(serverUrl + 'colleagues', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then(response => {
        responseData.value = response.data.colleagueList;
    }).catch(error => {
        console.error(error);
    })
})
</script>


<style scoped>
.addField {
    margin-left: 20px;
    margin-bottom: 30px;
}

.addLabel {
    display: block;
}

.addInput {
    margin-bottom: 10px;
}
</style>