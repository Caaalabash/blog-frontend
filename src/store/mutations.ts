import types from './types'
import { MutationTree } from 'vuex'
import router from '../router'


const mutations: MutationTree<any> = {
  [types.REDIRECT_TO](state,path){
    state.redirectTo = path
    router.push(path)
  },
  /*设置浏览的博客列表*/
  [types.SET_CURRENT_BLOG_LIST](state,data):void{
    state.currentBlogList = data
  },
  /*设置users信息*/
  [types.SET_USER](state,data):void{
    state.users = data
  },
  /*注销*/
  [types.LOG_OUT](state):void{
    const initState = state.initState()
    for (const key in initState) {
      state[key] = initState[key];
    }
  },
  /*是否在登录状态*/
  [types.LOGIN_SUCCESS](state):void{
    state.loginStatus = true
  },
  /*是否打开登录窗口*/
  [types.OPEN_LOGIN_DIALOG](state,data):void{
    state.openLoginDialog = data
  },
  /*创建新的博客*/
  [types.CREATE_NEW_IDEA](state,data):void{
    state.users.blogList.push(data)
  },
  /*修改某一篇博客*/
  [types.CHANGE_IDEA](state,data):void{
    state.users.blogList.map((item:any,index:any)=>{
      if(item.blogDate===data.blogDate){
        for (const key in data) {
          state.users.blogList[index][key] = data[key];
        }
      }
    })
  },
  /*返回首页 ,给currentUser重新赋值*/
  [types.BACK_INDEX](state):void{
    state.currentBlogList = state.users.blogList.filter((item:any)=>item.blogType==='public')
  },
  /*删除某条博客*/
  [types.DELETE_IDEA](state,data):void{
    state.users.blogList = state.users.blogList.filter((item:any)=>item.blogDate!==data.blogDate)
  },
  /*查询某一篇博客 */
  [types.GET_IDEA](state,data):void{
    //报废嗷
  },
  /*获取用户信息*/
  [types.GET_USER_INFO](state,data):void{
    state.users.userInfo = data
  },
  /*修改用户信息*/
  [types.CHANGE_USER_INFO](state,data):void{
    state.users.userInfo = data
  },
  /*获取博客列表*/
  [types.GET_IDEA_LIST](state,data):void{
    state.users.blogList = data
  }
}
export default mutations
