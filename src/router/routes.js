// src/router.js

import { createRouter, createWebHistory } from 'vue-router'
import WebMeeting from '../components/WebMeeting.vue'
import MainLayout from '../components/MainLayout.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainLayout
    },
    {
        path: '/conv',
        name: 'Meeting',
        component: WebMeeting,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router