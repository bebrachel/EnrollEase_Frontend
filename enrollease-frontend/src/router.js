import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './components/MainPage.vue'
import Applicants from './components/Applicants.vue'
import Portfolio from './components/Portfolio.vue'
import ApplicantDetails from './components/ApplicantDetails.vue'
import Settings from './components/Settings.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        name: 'MainPage',
        path: '/',
        component: MainPage
    }, {
        name: 'Portfolio',
        path: '/portfolio',
        component: Portfolio
    }, {
        name: 'Applicants',
        path: '/applicants',
        component: Applicants
    }, {
        name: 'ApplicantDetails',
        path: '/applicants/:number',
        component: ApplicantDetails,
        props: true,
        beforeEnter: (to, _from, next) => {
            const number = Number(to.params.number);
            if (!isNaN(number)) {
                next();
            } else {
                next('/applicants');
            }
        }
    }, {
        name: 'Settings',
        path: '/settings',
        component: Settings
    }, {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    }]
})

export default router;
