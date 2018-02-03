import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/page/Index.vue'
import BlogBody from '../components/base/BlogBody.vue'
import {getStorage} from '../lib/lib'
Vue.use(Router)

const router = new Router({
  routes: [
    //错误处理 放在后面error会被/:user动态路由匹配到
    {
      name:'error',
      path:'/error',
      component:resolve => require(['../components/page/error.vue'], resolve),
      props:true
    },
    //重定向
    {
      path:'/',
      redirect:'/Calabash'
    },
    {
      path:'/:user',
      component: index,
      props:true,
      children:[
        {
          path:'',
          component:BlogBody,
          props:true
        },{
          path:'articles/:id',
          component:resolve => require(['../components/base/BlogArticle.vue'], resolve),
          props:true
        }
      ]
    },{
      path:'/:user/manage',
      component:resolve => require(['../components/page/Manage.vue'], resolve),
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
          component:resolve => require(['../components/base/ManageYourIdea.vue'], resolve),
          props:(route)=>({blogDate:route.query.blogDate,userName:route.params.user})
        },
        {
          name:'ideas',
          path:'ideas',
          component:resolve => require(['../components/base/ManageIdea.vue'], resolve)
        }, {
          name:'setting',
          path: 'setting',
          component: resolve => require(['../components/base/ManageSetting.vue'], resolve)
        }
      ]
    }
  ],
  mode:'history'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getStorage('currentUser')!==to.params.user) {
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
