<template>
    <div v-if="portfolioData">
        <div id="search">
            <input type="text" v-model="searchString" placeholder="Поиск по ФИО">
        </div>
        <br>
        <div class="checkbox-group">
            <div>Статусы:</div>
            <label v-for="(item, index) in filterOptions" :key="index" class="checkbox-item">
                {{ item.label }}
                <input type="checkbox" v-model="selectedFilters" :value="item.value">
            </label>
        </div>
        <table class="custom-table">
            <colgroup>
                <col style="width: 24%;">
                <col style="width: 10%;">
                <col style="width: 10%;">
                <col style="width: 14%;">
                <col style="width: 12%;">
                <col style="width: 4%;">
                <col style="width: 26%;">
            </colgroup>
            <thead>
                <th v-for="column in listColumns" :key="column">{{ column }}</th>
            </thead>
            <tbody>
                <tr v-for="applicant in filteredData" :key="applicant.data['№']" @click="openLink(applicant.data.Ссылка)">
                    <td v-for="col in listColumns" :key="col">
                        <div>{{ editData(applicant.data, col) }}</div>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchString = ref('')
const listColumns = ref(["ФИО", "Дата создания", "Последнее изменение", "Контактные данные", "Статус", "Ранг", "Комментарии"])
const filterOptions = ref([
    { label: 'Отклонено', value: 'Отклонено' },
    { label: 'Нужна консультация', value: 'Нужна консультация' },
    { label: 'Финалист', value: 'Финалист' },
    { label: 'Кандидат', value: 'Кандидат в победители' },
    { label: 'Победитель', value: 'Победитель' },
    { label: 'Нет', value: '-' },
])
const selectedFilters = ref([])
const filteredData = computed(() => {
    const resultList = ref(portfolioData.value)
    if (searchString.value !== "") {
        return resultList.value.filter(applicant => {
            const search = searchString.value.toLowerCase()
            const lowerFIO = applicant.data.ФИО.toLowerCase()
            const fio = lowerFIO.split(' ');
            resultList.value = fio.some(substring => substring.startsWith(search)) ||
                lowerFIO.startsWith(search);
        })
    }
    if (selectedFilters.value.length !== 0) {
        return resultList.value.filter(row => {
            return selectedFilters.value.some(filter => row.data.Статус.includes(filter))
        })
    }
    return resultList.value

})
const openLink = (link) => {
    window.open(link, '_blank')
}


function editData(data, col) {
    if (col === "Дата создания" || col === "Последнее изменение") {
        return data[col].split(' ')[0]
    } else if (col === "Контактные данные") {
        return data["Телефон"] + ', ' + data["Email"];
    } else {
        return data[col]
    }
}


const portfolioData = ref([
    {
        "data": {
            "№": 1,
            "ФИО": "Иванов Иван Иванович",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "Отклонено",
            "Ранг": "5",
            "Комментарии": "Lorem",
            "Ссылка": ""
        },
    },
    {
        "data": {
            "№": 1,
            "ФИО": "Петров Петр Петрович",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "Нужна консультация",
            "Ранг": "7",
            "Комментарии": "Непонятно",
            "Ссылка": ""
        },
    },
    {
        "data": {
            "№": 1,
            "ФИО": "Сидоров Сидр Сидорович",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "Финалист",
            "Ранг": "9",
            "Комментарии": "норм",
            "Ссылка": ""
        },
    },
    {
        "data": {
            "№": 1,
            "ФИО": "Сидоров Сидр Сидорович",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "Кандидат в победители",
            "Ранг": "10",
            "Комментарии": "Топ",
            "Ссылка": ""
        },
    },
    {
        "data": {
            "№": 1,
            "ФИО": "Сидоров Сидр Сидорович",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "Победитель",
            "Ранг": "11",
            "Комментарии": "Вах",
            "Ссылка": ""
        },
    },
    {
        "data": {
            "№": 1,
            "ФИО": "Lorem ipsum dolor",
            "Дата создания": "06.11.1999 0:00:00",
            "Последнее изменение": "06.11.1999 0:00:00",
            "Email": "n.valikov@g.nsu.ru",
            "Телефон": "1-111-111-11-12",
            "Статус": "-",
            "Ранг": "-",
            "Комментарии": "-",
            "Ссылка": ""
        },
    },
])

</script>

<style scoped>
.checkbox-group {
    display: flex;
    gap: 25px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-item input[type="checkbox"]:hover {
    cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
    transform: scale(1.2);
    margin-left: 8px;
}
</style>