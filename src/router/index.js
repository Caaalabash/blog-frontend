import { createRouter, createWebHistory } from 'vue-router'
import { createRoutes } from '@/utils/route'

const moduleMap = import.meta.glob('../views/**/*.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/Calabash',
    },
    ...createRoutes(moduleMap, '../views/')
  ],
})

export default router
