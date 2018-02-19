/**
 * Created by 11210 on 2017/8/8.
 */
import * as types from './mutation-type'
import {setStorage,getStorage} from '../lib/lib'
import {initState} from './state'

const mutations = {
  [types.SET_CURRENT_BLOG_LIST](state,data){
    state.currentBlogList = data
  },
  [types.SET_USER](state,data){
    state.users = data
  },
  [types.LOG_OUT](state){
    setStorage('currentUser','')
    state = initState
  },
  [types.LOGIN_SUCCESS](state){
    state.loginStatus = true
  },
  [types.OPEN_LOGIN_DIALOG](state,data){
    state.ui.openLoginDialog = data
  },
  [types.CREATE_NEW_IDEA](state,data){
    state.users.blogList.push(data)
  },
  [types.CHANGE_IDEA](state,data){
    state.users.blogList.map((item,index,arr)=>{
      if(item.blogDate===data.blogDate){
        arr[index] = data
      }
    })
  },
  [types.GET_IDEA](state,data){
    state.queryIdea = data
  },
  [types.GET_USER_INFO](state,data){
    state.users.userInfo = data
  },
  [types.CHANGE_USER_INFO](state,data){
    state.users.userInfo = data
  },
  [types.GET_IDEA_LIST](state,data){
    Object.assign(state.users,data)
  },
  [types.DELETE_IDEA](state,data){
    state.users.blogList = state.users.blogList.filter((item)=>!item.blogDate===data.blogDate)
  }
}
export default  mutations
