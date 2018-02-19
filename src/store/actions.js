/**
 * Created by 11210 on 2017/8/8.
 */
import * as types from './mutation-type'
import apiManage from '../service/apiManage'
import {setStorage,getStorage} from '../lib/lib'

export const getCurrentBlogList = function({commit ,state},{userName}){
  apiManage.getIdeaList({userName}).then((res)=>{
    if(res.data.errno === 0){
      commit(types.SET_CURRENT_BLOG_LIST,res.data.res)
    }
  })
}

export const login = function({commit,state},data){
  apiManage.checkUser(data).then((res)=>{
    if(res.data.errno===0){
      setStorage('currentUser',res.data.res.userName)
      commit(types.SET_USER,res.data.res)
      commit(types.LOGIN_SUCCESS,true)
      commit(types.OPEN_LOGIN_DIALOG,false)
    }
  })
}

export const register = function({commit,state},data){
  apiManage.createUser(data).then((res)=>{
    if(res.data.errno===0){
      commit(types.SET_USER,res.data.res)
    }
  })
}

export const createNewIdea = function({commit,state},data){
  apiManage.createNewIdea(data).then((res)=>{
    if(res.data.errno===0){
      commit(types.CREATE_NEW_IDEA,data)
    }
  })
}

export const updateIdea = function({commit,state},data){
  apiManage.changeIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.CHANGE_IDEA,data)
    }
  })
}

export const getIdea = function({commit,state},data){
  apiManage.getIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_IDEA,res.data.res)
    }
  })
}

export const getUserInfo = function({commit,state},data){
  apiManage.getUserInfo(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_USER_INFO,res.data.res)
    }
  })
}

export const updateUserInfo = function({commit,state},data){
  apiManage.changeUserInfo(data).then(res=>{
    if(res.data.errno===0){
      commit(types.CHANGE_USER_INFO,data)
    }
  })
}

export const getIdeaList = function({commit,state},data){
  apiManage.getIdeaList(data).then(res=>{
    if(res.data.errno===0){
      commit(types.GET_IDEA_LIST,res.data.msg)
    }
  })
}

export const deleteIdea = function({commit,state},data){
  apiManage.deleteIdea(data).then(res=>{
    if(res.data.errno===0){
      commit(types.DELETE_IDEA,data)
    }
  })
}
