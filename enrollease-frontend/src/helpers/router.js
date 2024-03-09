import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';
import MainPage from '@/components/MainPage.vue';
import Applicants from '@/components/Applicants.vue';
import ApplicantDetails from '@/components/ApplicantDetails.vue'
import Portfolio from '@/components/Portfolio.vue';
import Settings from '@/components/Settings.vue';
import LoginView from '@/components/LoginView.vue';


export const router = createRouter({
    history: createWebHistory(),
    routes: [{
        name: 'MainPage',
        path: '/',
        component: MainPage
    }, {
        name: 'LoginView',
        path: '/login',
        component: LoginView
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

router.beforeEach(async (to) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
})