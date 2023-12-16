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
                    <td>
                        <router-link :to="{ name: 'ApplicantDetails', params: { number: applicant.data['№'] - 1 } }"
                            class="link">
                            {{ applicant.data.ФИО }}
                        </router-link>
                    </td>
                    <td v-for="col in listColumns.slice(1)" :key="col">
                        <div v-if="col != 'ФИО'">
                            {{ editData(applicant.data, col) }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>



<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import axios from 'axios'

const serverUrl = inject("serverUrl")
const token = inject("token")
const applicantList = inject("applicantList")
const selectedFilter = ref('')
const listColumns = ref(["ФИО", "Оригинал", "Пол", "Состояние", "Возраст", "Житель города", "Направление\\специальность", "Сумма баллов по ИД", "Сумма баллов"])

const filteredData = computed(() => {
    if (applicantList && selectedFilter.value === 'descending') {
        return applicantList.value.slice().sort((a, b) => b.data['Сумма баллов'] - a.data['Сумма баллов'])
    } else {
        return applicantList.value
    }
})

function parseDateString(dateString) {
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}, ${month}, ${day}`);
}

function calculateAge(birthDate) {
    const birthDateObj = parseDateString(birthDate)
    const currentDate = new Date()
    const timeDiff = currentDate - birthDateObj
    const age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25))
    return age
}

function editData(data, col) {
    if (col === 'Возраст') {
        return calculateAge(data['Дата рождения'].split(' ')[0])
    } else {
        return data[col]
    }
}

onMounted(() => {
    axios.get(serverUrl + 'applicants', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    }).then(response => {
        applicantList.value = response.data.applicantList
    }).catch(error => {
        console.error(error)
    })
})
</script>



<style scoped>
.link {
    text-decoration: none
}
</style>
