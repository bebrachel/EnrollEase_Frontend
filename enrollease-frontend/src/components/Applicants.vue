<template>
    <div v-if="filteredData">
        <div id="search">
            <div>
                <label for="sortByScore">Фильтр по убыванию суммы баллов:</label>
                <select id="sortByScore" v-model="selectedFilter">
                    <option value="">Без фильтра</option>
                    <option value="descending">По убыванию</option>
                </select>
            </div>
            <input id="searchString" type="text" v-model="searchString" placeholder="Поиск по ФИО">
        </div>
        <table class="custom-table">
            <thead>
                <th v-for="column in listColumns" :key="column">{{ column }}</th>
            </thead>
            <tbody>
                <tr v-for="applicant in filteredData" key="№" @click="goToTheApplicant(applicant.data['№'])">
                    <td style="cursor: pointer;">
                        {{ applicant.data.ФИО }}
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
import { useRouter } from 'vue-router'
import { useNotification } from '@kyvg/vue3-notification';
import { fetchWrapper } from '@/helpers/fetch-wrapper'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { api_uri } = storeToRefs(authStore)
const router = useRouter()
const { notify } = useNotification()

const applicantList = inject("applicantList")
const selectedFilter = ref('')
const searchString = ref('')
const listColumns = ref(["ФИО", "Оригинал", "Пол", "Состояние", "Возраст", "Житель города", "Направление\\специальность", "Сумма баллов по ИД", "Сумма баллов"])

const filteredData = computed(() => {
    if (!applicantList || !applicantList.value) {
        return [];
    }
    let data = applicantList.value;
    if (selectedFilter.value === 'descending') {
        data = data.slice().sort((a, b) => b.data['Сумма баллов'] - a.data['Сумма баллов']);
    }
    if (searchString.value !== "") {
        const search = searchString.value.toLowerCase();
        data = data.filter(applicant => {
            const lowerFIO = applicant.data.ФИО.toLowerCase();
            const fio = lowerFIO.split(' ');
            return fio.some(substring => substring.startsWith(search)) ||
                lowerFIO.startsWith(search);
        })
    }
    return data;
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

function goToTheApplicant(n) {
    router.push({ name: 'ApplicantDetails', params: { number: `${n - 1}` } })
}

function createNotif(type, text) {
    notify({
        group: "app",
        type: type,
        text: text,
    })
}

onMounted(async () => {
    await fetchWrapper.get(api_uri.value + 'applicants')
        .then(response => {
            applicantList.value = response.data.applicantList
        }).catch(() => {
            createNotif("error", "Ошибка загрузки абитуриентов")
        })
})
</script>



<style scoped>
.link {
    text-decoration: none
}

#search {
    display: flex;
    justify-content: space-between;
}

#searchString {
    margin-right: 40px;
}
</style>
