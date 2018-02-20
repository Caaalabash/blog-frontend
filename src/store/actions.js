import * as types from './mutation-type'
import apiManage from '../service/apiManage'

//获取匹配user的博文列表
export const getCurrentBlogList = function({commit ,state},{userName}){
  apiManage.getIdeaList({userName}).then((res)=>{
    commit(types.SET_CURRENT_BLOG_LIST,res.data.res)
    commit(types.REQUEST_ERR,res.data)
  })
}
/*登录*/
export const login = function({commit,state},data){
  apiManage.checkUser(data).then((res)=>{
    if(res.data.errno===0){
      //设置users,loginStatus,关闭窗口,重定向
      commit(types.SET_USER,res.data.res)
      commit(types.LOGIN_SUCCESS,true)
      commit(types.OPEN_LOGIN_DIALOG,false)
      commit(types.REDIRECT_TO,`/${res.data.res.userName}/manage`)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*注册*/
export const register = function({commit,state},data){
  apiManage.createUser(data).then((res)=>{
    //反馈请求结果,不操作state
    commit(types.REQUEST_ERR,res.data)
  })
}
/*发布新博文*/
export const createNewIdea = function({commit,state},data){
  apiManage.createNewIdea(data).then((res)=>{
    if(res.data.errno===0){
      commit(types.CREATE_NEW_IDEA,data)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*更新博文*/
export const updateIdea = function({commit,state},data){
  apiManage.changeIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.CHANGE_IDEA,data)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*获取某条博文 暂未用到*/
export const getIdea = function({commit,state},data){
  apiManage.getIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_IDEA,res.data.res)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*获取用户信息*/
export const getUserInfo = function({commit,state},data){
  apiManage.getUserInfo(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_USER_INFO,res.data.res)
    }
  })
}
/*更新用户信息*/
export const updateUserInfo = function({commit,state},data){
  apiManage.changeUserInfo(data).then(res=>{
    if(res.data.errno===0){
      commit(types.CHANGE_USER_INFO,data)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*获取博文列表:可以和获取当前博文列表合并*/
export const getIdeaList = function({commit,state},data){
  apiManage.getIdeaList(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_IDEA_LIST,res.data.res)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
/*删除博文*/
export const deleteIdea = function({commit,state},data){
  apiManage.deleteIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.DELETE_IDEA,data)
    }
    commit(types.REQUEST_ERR,res.data)
  })
}
