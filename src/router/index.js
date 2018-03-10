import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';
import Index from '@/components/page/Index.vue';
var BlogBody = function () { return import('@/components/base/BlogBody.vue'); };
var error = function () { return import('@/components/page/error.vue'); };
var BlogArticle = function () { return import('@/components/base/BlogArticle.vue'); };
var Manage = function () { return import('@/components/page/Manage.vue'); };
var ManageYourIdea = function () { return import('@/components/base/ManageYourIdea.vue'); };
var ManageIdea = function () { return import('@/components/base/ManageIdea.vue'); };
var ManageSetting = function () { return import('@/components/base/ManageSetting.vue'); };
Vue.use(Router);
var routes = [
    //错误处理 放在后面error会被/:user动态路由匹配到
    {
        name: 'error',
        path: '/error',
        component: error,
        props: true
    },
    //重定向
    {
        path: '/',
        redirect: '/Calabash'
    },
    {
        path: '/:user',
        component: Index,
        props: true,
        children: [
            {
                path: '',
                component: BlogBody,
                props: true
            }, {
                path: 'articles/:id',
                component: BlogArticle,
                props: true
            }
        ]
    },
    {
        path: '/:user/manage',
        component: Manage,
        props: true,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: 'new-idea'
            },
            {
                name: 'new-idea',
                path: 'new-idea',
                component: ManageYourIdea,
                props: function (route) { return ({ blogDate: route.query.blogDate, userName: route.params.userName }); }
            },
            {
                name: 'ideas',
                path: 'ideas',
                component: ManageIdea,
            }, {
                name: 'setting',
                path: 'setting',
                component: ManageSetting
            }
        ]
    }
];
var router = new Router({
    mode: 'history',
    base: '/',
    routes: routes
});
router.beforeEach(function (to, from, next) {
    if (to.matched.some(function (record) { return record.meta.requiresAuth; })) {
        if (store.getters.userName !== to.params.user) {
            next({
                name: 'error',
                params: { type: '权限不足' }
            });
        }
        else {
            next();
        }
    }
    else {
        next();
    }
});
export default router;
