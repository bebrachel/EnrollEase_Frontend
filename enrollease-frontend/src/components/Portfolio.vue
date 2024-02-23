<template>
    <div>
        <div class="group">
            <div id="search">
                <input type="text" v-model="searchString" placeholder="Поиск по ФИО">
                <span class="clear-icon" @click="clearInput">✕</span>
            </div>
            <label class="switch">
                <input type="checkbox" v-model="switchChecked" @change="handleSwitchChange">
                <span class="slider round"></span>
            </label>
            <span style="margin-left: -20px;">Открыть на запись</span>
            <button style="margin-left: 20px;">Сгенерировать сертификаты</button>
            <button style="margin-left: 20px;">Перенести данные в “Абитуриенты”</button>
            <button id="saveButton" style="margin-left: auto; margin-right: 50px;">Сохранить</button>
        </div>
        <br>
        <div class="group">
            <div>Статусы:</div>
            <label v-for="(item, index) in filterOptions" :key="index" class="checkbox-item">
                {{ item.label }}
                <input type="checkbox" v-model="selectedFilters" :value="item.value">
            </label>
            <button v-if="selectedFilters.length && selectedFilters.length !== 0" id="buttonClear"
                @click="clearCheckboxes">Очистить</button>
        </div>
        <table class="custom-table" v-if="portfolioData">
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
                <th v-for="column in listColumns" :key="column">
                    <span v-if="isContactStatusComm(column)" @click="sortColumn(column)" class="pointerCursor">{{ column
                    }}<sub style="color: gray;">v</sub></span>
                    <span v-else>{{ column }}</span>
                </th>
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
const switchChecked = ref(false)
const sortOrder = ref(1)
const sortBy = ref('')
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
    let data = portfolioData.value;
    if (searchString.value !== "") {
        const search = searchString.value.toLowerCase();
        data = data.filter(applicant => {
            const lowerFIO = applicant.data.ФИО.toLowerCase();
            const fio = lowerFIO.split(' ');
            return fio.some(substring => substring.startsWith(search)) ||
                lowerFIO.startsWith(search);
        });
    }
    if (selectedFilters.value.length !== 0) {
        data = data.filter(applicant => {
            return selectedFilters.value.some(filter => applicant.data.Статус.includes(filter));
        });
    }
    if (sortBy.value === '') {
        return data;
    } else {
        return data.slice().sort((a, b) => {
            let columnA = a.data[sortBy.value];
            let columnB = b.data[sortBy.value];

            if (sortBy.value === "Дата создания" || sortBy.value === "Последнее изменение") {
                columnA = new Date(columnA.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
                columnB = new Date(columnB.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
            }

            if (sortBy.value === "Ранг") {
                if (columnA === '-' || isNaN(Number(columnA))) {
                    columnA = Infinity;
                } else {
                    columnA = Number(columnA);
                }

                if (columnB === '-' || isNaN(Number(columnB))) {
                    columnB = Infinity;
                } else {
                    columnB = Number(columnB);
                }
            }

            if (columnA < columnB) return -1 * sortOrder.value;
            if (columnA > columnB) return 1 * sortOrder.value;
            return 0;
        });
    }
})

function sortData() {
    
}

function isContactStatusComm(column) {
    return column !== "Контактные данные" && column !== "Статус" && column !== "Комментарии";
}

function sortColumn(column) {
    if (sortBy.value !== column) {
        sortBy.value = column
        sortOrder.value = 1
    } else {
        sortOrder.value === 1 ? sortOrder.value = -1 : sortOrder.value = 1
    }
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

const openLink = (link) => {
    window.open(link, '_blank')
}

function handleSwitchChange() {
    console.log(switchChecked.value)
    // сюда потом добавить отправку на сервер изменений
}

function clearInput() {
    searchString.value = ''
}

function clearCheckboxes() {
    selectedFilters.value = []
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
            "Дата создания": "12.11.1999 0:00:00",
            "Последнее изменение": "12.11.1999 0:00:00",
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
            "ФИО": "Яковлева Анастасия Викторовна",
            "Дата создания": "06.11.2000 0:00:00",
            "Последнее изменение": "06.11.2000 0:00:00",
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
            "Дата создания": "06.05.1999 0:00:00",
            "Последнее изменение": "06.05.1999 0:00:00",
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
            "ФИО": "Ватрушкин Петр Сергеевич",
            "Дата создания": "06.11.1998 0:00:00",
            "Последнее изменение": "06.11.1998 0:00:00",
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
            "ФИО": "Арбузов Николай Иванович",
            "Дата создания": "31.12.1999 0:00:00",
            "Последнее изменение": "31.12.1999 0:00:00",
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
.group {
    position: relative;
    display: flex;
    align-items: center;
    gap: 25px;
    margin-bottom: 15px;
}

.checkbox-item {
    display: flex;
    align-items: end;
    cursor: pointer;
}

.checkbox-item input[type="checkbox"]:hover {
    cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
    transform: scale(1.2);
    margin-left: 8px;
}

#search {
    position: relative;
}

.clear-icon {
    position: absolute;
    top: 50%;
    margin-left: 5px;
    transform: translateY(-50%);
    cursor: pointer;
}

.switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
    margin-left: 50px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 8.5px;
    overflow: hidden;
}

.slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

#buttonClear {
    background-color: rgb(255, 179, 179);
    border: none;
    border-radius: 5px;
}

#buttonClear:active {
    background-color: rgb(255, 110, 110);
}

#saveButton {
    background-color: rgb(178, 255, 178);
    border: none;
}

.pointerCursor {
    cursor: pointer;
}
</style>