<template>
    <div v-if="filteredData">
        <div class="element">
            <label for="sortByScore">Фильтр по убыванию суммы баллов:</label>
            <select id="sortByScore" v-model="selectedFilter">
                <option value="">Без фильтра</option>
                <option value="descending">По убыванию</option>
            </select>
        </div>
        <table class="custom-table">
            <thead>
                <th v-for="column in listColumns" :key="column">{{ column }}</th>
            </thead>
            <tbody>
                <tr v-for="applicant in filteredData" key="№">
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
</template>



<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import axios from 'axios'

const serverUrl = inject("serverUrl")
const token = inject("token")
const responseData = ref(null)
const selectedFilter = ref('')
const listColumns = ref(["ФИО", "Оригинал", "Пол", "Состояние", "Дата рождения", "Житель города", "Направление\\специальность", "Сумма баллов по ИД", "Сумма баллов"])

const filteredData = computed(() => {
    if (responseData && selectedFilter.value === 'descending') {
        return responseData.value.slice().sort((a, b) => b.data['Сумма баллов'] - a.data['Сумма баллов'])
    } else {
        return responseData.value
    }
})

onMounted(() => {
    axios.get(serverUrl + 'applicants', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then(response => {
        responseData.value = response.data.applicantList;
    }).catch(error => {
        console.error(error);
    })
})
</script>
