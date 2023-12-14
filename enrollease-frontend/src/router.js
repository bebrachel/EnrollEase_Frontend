import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './components/MainPage.vue'
import Settings from './components/Settings.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        name: 'Applicants',
        path: '/applicants',
        component: MainPage
    }, {
        name: 'Settings',
        path: '/settings',
        component: Settings
    }]
})

export default router;
