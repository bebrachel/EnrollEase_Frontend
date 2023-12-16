import { createRouter, createWebHistory } from 'vue-router'
import Applicants from './components/Applicants.vue'
import Settings from './components/Settings.vue'
import MainPage from './components/MainPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        name: 'MainPage',
        path: '/',
        component: MainPage
    }, {
        name: 'Applicants',
        path: '/applicants',
        component: Applicants
    }, {
        name: 'Settings',
        path: '/settings',
        component: Settings
    }]
})

export default router;
