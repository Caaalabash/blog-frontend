import { createRouter, createWebHistory } from 'vue-router'
import { createRoutes } from '@/utils/route'
import { useUserStore } from '@/stores/user'

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

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isLogin && to.path.indexOf('/admin') > -1) {
    next('/error?code=401')
  } else {
    next()
  }
})

export default router
