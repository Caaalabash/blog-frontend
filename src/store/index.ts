import Vue from 'vue'
import Vuex, { ActionTree, MutationTree } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

interface State {
  loginStatus: boolean,
  currentBlogList:Array<StoreState.blog>,
  users:StoreState.users
  searchIdea:string,
  redirectTo:string,
  openLoginDialog:boolean,
}

let initState: State = {
    //当前所在的博文列表,用于实现上一篇,下一篇
    currentBlogList:[],
    //当前登录状态
    loginStatus:false,
    //当前登录用户的信息
    users:{
      userName:'',
      _id:'',
      userInfo:{
        twitter:'http://www.lanternpro.site/',
        github:'https://github.com/',
        weibo:'https://weibo.com/'
      },
      blogList:[{
        _id:'',
        blogTitle:'',
        blogDate:'',
        blogContent:'',
        blogType:''
      }]
    },
    //用于修改的博文标识
    searchIdea:'',
    //重定向的路径,目前用于登录后控制路由跳转到管理页
    redirectTo:'',
    openLoginDialog:false,
}

let state = {
  ...initState,
  initState(){
    return initState
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: [createPersistedState()]
})
