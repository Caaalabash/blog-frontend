var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
var initState = {
    //当前所在的博文列表,用于实现上一篇,下一篇
    currentBlogList: [],
    //当前登录状态
    loginStatus: false,
    //当前登录用户的信息
    users: {
        userName: '',
        _id: '',
        userInfo: {
            twitter: 'http://www.lanternpro.site/',
            github: 'https://github.com/',
            weibo: 'https://weibo.com/'
        },
        blogList: [{
                _id: '',
                blogTitle: '',
                blogDate: '',
                blogContent: '',
                blogType: ''
            }]
    },
    //用于修改的博文标识
    searchIdea: '',
    //重定向的路径,目前用于登录后控制路由跳转到管理页
    redirectTo: '',
    openLoginDialog: false,
};
var state = __assign({}, initState, { initState: function () {
        return initState;
    } });
export default new Vuex.Store({
    state: state,
    actions: actions,
    getters: getters,
    mutations: mutations,
    plugins: [createPersistedState()]
});
