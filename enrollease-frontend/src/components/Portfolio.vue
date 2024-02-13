<template>
    <div v-if="portfolioData">
        <div id="search">
            <input type="text" v-model="searchString" placeholder="Поиск по ФИО">
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
                <tr>
                    <th v-for="column in listColumns" :key="column">{{ column }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="applicant in filteredData" :key="applicant.data['№']">
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
const filteredData = computed(() => {
    const resultList = ref(portfolioData.value)
    if (searchString.value !== "") {
        return resultList.value.filter(applicant => {
            const search = searchString.value.toLowerCase()
            const lowerFIO = applicant.data.ФИО.toLowerCase()
            const fio = lowerFIO.split(' ');
            return fio.some(substring => substring.startsWith(search)) ||
                lowerFIO.startsWith(search);
        });
    } else {
        return resultList.value
    }
})
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
            "Комментарии": "Lorem"
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
            "Комментарии": "Непонятно"
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
            "Комментарии": "норм"
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
            "Комментарии": "Топ"
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
            "Комментарии": "Вах"
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
            "Комментарии": "-"
        },
    },
])

</script>