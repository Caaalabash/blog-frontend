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
    ...createRoutes(moduleMap, '../views/'),
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error?code=404'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0, left: 0 }
  }
})

export default router
