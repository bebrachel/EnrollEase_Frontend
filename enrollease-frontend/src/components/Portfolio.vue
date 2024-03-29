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
            <button style="margin-left: 20px;" @click="generateSertificates">Сгенерировать сертификаты</button>
            <button style="margin-left: 20px;" @click="importApplicants">Перенести данные в “Абитуриенты”</button>
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
                <tr v-for="applicant in filteredData">
                    <td v-for="col in listColumns" :key="col">
                        <div v-if="col === listColumns[0]"
                            @click="openLink('https://drive.google.com/drive/folders/' + applicant.folderId)"
                            style="cursor: pointer;">
                            {{ editData(applicant, col) }}</div>
                        <div v-else>{{ editData(applicant, col) }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@kyvg/vue3-notification';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetch-wrapper.js'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { api_uri } = storeToRefs(authStore)

const { notify } = useNotification()

const searchString = ref('')
const switchChecked = ref(false)
const sortOrder = ref(1)
const sortBy = ref('')
const portfolioData = ref()
// при изменении названий нужно сохранять смысловой порядок колонок в списке
const listColumns = ref(["name", "folderCreationDate", "folderUpdatedAt", "email", "status", "rank", "commentaries"])
const filterOptions = ref([
    { label: 'Отклонено', value: 'Отклонено' },
    { label: 'Нужна консультация', value: 'Нужна консультация' },
    { label: 'Финалист', value: 'Финалист' },
    { label: 'Кандидат', value: 'Кандидат в победители' },
    { label: 'Победитель', value: 'Победитель' },
    { label: 'Нет', value: 'PARTICIPANT' },
])
const selectedFilters = ref([])
const filteredData = computed(() => {
    let data = portfolioData.value;
    if (searchString.value !== "") {
        const search = searchString.value.toLowerCase();
        data = data.filter(applicant => {
            const lowerFIO = applicant[listColumns.value[0]].toLowerCase();
            const fio = lowerFIO.split(' ');
            return fio.some(substring => substring.startsWith(search)) ||
                lowerFIO.startsWith(search);
        });
    }
    if (selectedFilters.value.length !== 0) {
        data = data.filter(applicant => {
            return selectedFilters.value.some(filter => applicant[listColumns.value[4]].includes(filter));
        });
    }
    if (sortBy.value === '') {
        return data;
    } else {
        return data.slice().sort((a, b) => {
            let columnA = a[sortBy.value];
            let columnB = b[sortBy.value];

            if (sortBy.value === listColumns.value[1] || sortBy.value === listColumns.value[2]) {
                columnA = new Date(columnA.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
                columnB = new Date(columnB.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
            }

            if (sortBy.value === listColumns.value[5]) {
                if (columnA === '-' || isNaN(Number(columnA))) {
                    columnA = -Infinity;
                } else {
                    columnA = Number(columnA);
                }

                if (columnB === '-' || isNaN(Number(columnB))) {
                    columnB = -Infinity;
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

function isContactStatusComm(column) {
    return column !== listColumns.value[3] && column !== listColumns.value[4] && column !== listColumns.value[6];
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
    if (col === listColumns.value[1] || col === listColumns.value[2]) {
        return data[col].split(' ')[0]
    } else if (col === listColumns.value[3]) {
        //return data["Телефон"] + ', ' + data[listColumns.value[3]]
        return data[listColumns.value[3]]
    } else {
        return data[col]
    }
}

const openLink = (link) => {
    window.open(link, '_blank')
}

function clearInput() {
    searchString.value = ''
}

function clearCheckboxes() {
    selectedFilters.value = []
}

function createNotif(type, text) {
    notify({
        group: "app",
        type: type,
        text: text,
    })
}

function createSwal() {
    return Swal.fire({
        title: 'Подтвердите действие',
        text: 'Вы уверены, что хотите продолжить?',
        icon: 'question',
        showDenyButton: "true"
    })
}

function handleSwitchChange() {
    createSwal().then((result) => {
        if (result.isConfirmed && (switchChecked.value === true)) {
            // отправить на сервер просьбу открыть доступ на редактирование папок
        } else if (result.isConfirmed && (switchChecked.value === false)) {
            // отправить серверу просьбу закрыть доступ к папкам на редактирование
        } else {
            switchChecked.value = !switchChecked.value
        }
    })
}

function generateSertificates() {
    createSwal().then(async (result) => {
        if (result.isConfirmed) {
            createNotif("warn", "Пожалуйста, подождите...")
            await fetchWrapper.get(api_uri.value + 'applicants-portfolio/generate-sertificates')
                .then(() => {
                    createNotif("success", "Сертификаты сгенерированы!")
                }).catch(() => {
                    createNotif("error", "Возникла ошибка!")
                })
        }
    })
}

function importApplicants() {
    createSwal().then(async (result) => {
        if (result.isConfirmed) {
            createNotif("warn", "Пожалуйста, подождите...")
            await fetchWrapper.get(api_uri.value + 'applicants-portfolio/import-applicants')
                .then(() => {
                    createNotif("success", "Данные успешно перенесены!")
                }).catch(() => {
                    createNotif("error", "Возникла ошибка!")
                })
        }
    })
}

onMounted(async () => {
    await fetchWrapper.get(api_uri.value + 'applicants-portfolio').then((response) => {
        portfolioData.value = response.applicantList
    }).catch(() => {
        createNotif("error", "Ошибка загрузки портфолио")
    })
})
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