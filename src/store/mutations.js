import * as types from './mutation-type'
import {Message} from 'element-ui'
import router from '../router'

const mutations = {
  /*全局错误提示*/
  [types.REQUEST_ERR](state,{errno,msg}){
    state.error = {errno,msg}
    /*ELEMENT UI  message*/
    if(msg.length){
      errno ? Message.error({message:msg}):Message.success({message:msg})
    }
  },
  /*路由跳转*/
  [types.REDIRECT_TO](state,path){
    state.redirectTo = path
    router.push(path)
  },
  /*设置浏览的博客列表*/
  [types.SET_CURRENT_BLOG_LIST](state,data){
    state.currentBlogList = data
  },
  /*设置users信息*/
  [types.SET_USER](state,data){
    state.users = data
  },
  /*注销*/
  [types.LOG_OUT](state){
    const initState = state.initState()
    for (const key in initState) {
      state[key] = initState[key];
    }
  },
  /*是否在登录状态*/
  [types.LOGIN_SUCCESS](state){
    state.loginStatus = true
  },
  /*是否打开登录窗口*/
  [types.OPEN_LOGIN_DIALOG](state,data){
    state.ui.openLoginDialog = data
  },
  /*创建新的博客*/
  [types.CREATE_NEW_IDEA](state,data){
    state.users.blogList.push(data)
  },
  /*修改某一篇博客*/
  [types.CHANGE_IDEA](state,data){
    state.users.blogList.map((item,index)=>{
      if(item.blogDate===data.blogDate){
        state.users.blogList[index] = data
      }
    })
  },
  /*删除某条博客*/
  [types.DELETE_IDEA](state,data){
    state.users.blogList = state.users.blogList.filter((item)=>item.blogDate!==data.blogDate)
  },
  /*查询某一篇博客 */
  [types.GET_IDEA](state,data){
    //报废嗷
  },
  /*获取用户信息*/
  [types.GET_USER_INFO](state,data){
    state.users.userInfo = data
  },
  /*修改用户信息*/
  [types.CHANGE_USER_INFO](state,data){
    state.users.userInfo = data
  },
  /*获取博客列表*/
  [types.GET_IDEA_LIST](state,data){
    state.users.blogList = data
  }
}
export default  mutations
