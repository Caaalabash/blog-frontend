import { ActionTree } from 'vuex'
import types from './types'
import apiManage from '../service/apiManage.js'



const actions: ActionTree<any, any> = {
  getCurrentBlogList({commit ,state},data:Object):void{
    apiManage.getIdeaList(data).then((res:Ajax.AjaxResponse)=>{
      commit(types.SET_CURRENT_BLOG_LIST,res.res)
    },(e:any)=>{console.log(e)},(e:any)=>{console.log(e)})
  },
  login({commit,state},data:Object):void{
    apiManage.checkUser(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        //设置users,loginStatus,关闭窗口,重定向
        commit(types.SET_USER,res.res)
        commit(types.LOGIN_SUCCESS,true)
        commit(types.OPEN_LOGIN_DIALOG,false)
        commit(types.REDIRECT_TO,`/${res.res.userName}/manage`)
      }

    },(e:any)=>{console.log(e)})
  },
  /*注册*/
  register({commit,state},data){
    apiManage.createUser(data).then((res:Ajax.AjaxResponse)=>{
      //反馈请求结果,不操作state

    },(e:any)=>{console.log(e)})
  },
  /*发布新博文*/
  createNewIdea({commit,state},data:Object){
    apiManage.createNewIdea(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.CREATE_NEW_IDEA,data)
      }

    },(e:any)=>{console.log(e)})
  },
  /*更新博文*/
  updateIdea({commit,state},data){
    apiManage.changeIdea(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.CHANGE_IDEA,data)
      }

    },(e:any)=>{console.log(e)})
  },
  /*获取某条博文 暂未用到*/
  getIdea({commit,state},data){
    apiManage.getIdea(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.GET_IDEA,res.res)
      }

    },(e:any)=>{console.log(e)})
  },
  /*获取用户信息*/
  getUserInfo({commit,state},data){
    apiManage.getUserInfo(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){

      }
    },(e:any)=>{console.log(e)})
  },
  /*更新用户信息*/
  updateUserInfo({commit,state},data){
    apiManage.changeUserInfo(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.CHANGE_USER_INFO,data)
      }

    },(e:any)=>{console.log(e)})
  },
  /*获取博文列表:可以和获取当前博文列表合并*/
  getIdeaList({commit,state},data){
    apiManage.getIdeaList(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.GET_IDEA_LIST,res.res)
      }

    },(e:any)=>{console.log(e)})
  },
  /*删除博文*/
  deleteIdea({commit,state},data){
    apiManage.deleteIdea(data).then((res:Ajax.AjaxResponse)=>{
      if(res.errno===0){
        commit(types.DELETE_IDEA,data)
      }

    },(e:any)=>{console.log(e)})
  }

}

export default actions
