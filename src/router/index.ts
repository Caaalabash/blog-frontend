import Vue, { AsyncComponent } from 'vue'
import Router, { RouteConfig, Route, NavigationGuard } from 'vue-router'
import store from '../store/index'
import Index from '@/components/page/Index.vue'


const BlogBody:AsyncComponent = ():any=>import('@/components/base/BlogBody.vue')
const error: AsyncComponent = (): any => import('@/components/page/error.vue')
const BlogArticle: AsyncComponent = (): any => import('@/components/base/BlogArticle.vue')
const Manage: AsyncComponent = (): any => import('@/components/page/Manage.vue')
const ManageYourIdea: AsyncComponent = (): any => import('@/components/base/ManageYourIdea.vue')
const ManageIdea: AsyncComponent = (): any => import('@/components/base/ManageIdea.vue')
const ManageSetting: AsyncComponent = (): any => import('@/components/base/ManageSetting.vue')


Vue.use(Router)

const routes: RouteConfig[] = [
  //错误处理 放在后面error会被/:user动态路由匹配到
  {
    name:'error',
    path:'/error',
    component:error,
    props:true
  },
  //重定向
  {
    path:'/',
    redirect:'/Calabash'
  },
  {
    path:'/:user',
    component: Index,
    props:true,
    children:[
      {
        path:'',
        component:BlogBody,
        props:true
      },{
        path:'articles/:id',
        component: BlogArticle,
        props:true
      }
    ]
  },
  {
    path:'/:user/manage',
    component:Manage,
    props: true,
    meta:{requiresAuth: true},
    children:[
      {
        path:'',
        redirect:'new-idea'
      },
      {
        name:'new-idea',
        path:'new-idea',
        component:ManageYourIdea,
        props:(route)=>({blogDate:route.query.blogDate,userName:route.params.userName})
      },
      {
        name:'ideas',
        path:'ideas',
        component:ManageIdea,
      }, {
        name:'setting',
        path: 'setting',
        component:ManageSetting
      }
    ]
  }
]


const router: Router = new Router({
  mode: 'history',
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.userName!==to.params.user) {
      next({
        name: 'error',
        params: { type:'权限不足' }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
