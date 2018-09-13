import * as types from './mutation-type'
import apiManage from '../service/apiManage'

//获取匹配user的博文列表
export const getCurrentBlogList = function({commit ,state},data){
  apiManage.getIdeaList(data).then((res)=>{
    if(res.errno===0){
      commit(types.SET_CURRENT_BLOG_LIST,res.res)
    }
    else{//如果该用户没有文章,重定向到Calabash
      commit(types.REDIRECT_TO,`/Calabash`)
    }
  })
}
/*加载更多*/
export async function getMoreBlog({commit,state},data){
  let res = await apiManage.getIdeaList(data)
  if(res.errno===0){
    commit(types.LOAD_MORE,res.res)
  }
  if(res.res.length<data.pgS){
    return 'gg'
  }
}
/*登录*/
export const login = function({commit,state},data){
  apiManage.checkUser(data).then((res)=>{
    if(res.errno===0){
      commit(types.OPEN_LOGIN_DIALOG,false)
      commit(types.SET_USER,res.res)
      commit(types.SET_LOGIN_STATUS,true)
      commit(types.SET_TOKEN,res.token)
      commit(types.REDIRECT_TO,`/${res.res.userName}/manage`)
    }
  })
}
/*注册*/
export const register = function({commit,state},data){
  apiManage.createUser(data).then((res)=>{
    //反馈请求结果,不操作state
  })
}
/*发布新博文*/
export const createNewIdea = function({commit,state},data){
  apiManage.createNewIdea(data).then((res)=>{
    if(res.errno===0){
      commit(types.CREATE_NEW_IDEA,data)
      //从浏览器中删除缓存
      localStorage.removeItem(`manuscript`)
    }

  })
}
/*更新博文*/
export const updateIdea = function({commit,state},data){
  apiManage.changeIdea(data).then(res=>{
    if(res.errno===0){
      commit(types.CHANGE_IDEA,data)
      //从浏览器中删除缓存
      localStorage.removeItem(`article${data.blogDate}`)
    }

  })
}
/*获取某条博文*/
export const getIdea = function({commit,state},data){
  return apiManage.getIdea(data).then(res=>{
    if(res.errno===0){
      commit(types.GET_IDEA,res.res)
    }
  })
}
/*获取用户信息*/
export const getUserInfo = function({commit,state},data){
  return apiManage.getUserInfo(data).then(res=>{
    if(res.errno===0){
      //如果是当前用户
      if(state.users.userName===data.userName){
        commit(types.GET_USER_INFO,res.res)
        return 1
      }else{
        return res.res
      }
    }
  })
}
/*更新用户信息*/
export const updateUserInfo = function({commit,state},data){
  apiManage.changeUserInfo(data).then(res=>{
    if(res.errno===0){
      commit(types.CHANGE_USER_INFO,data)
    }

  })
}
/*获取博文列表*/
export const getIdeaList = function({commit,state},data){
  apiManage.getIdeaList(data).then(res=>{
    if(res.errno===0){
      commit(types.GET_IDEA_LIST,res.res)
    }

  })
}
/*删除博文*/
export const deleteIdea = function({commit,state},data){
  apiManage.deleteIdea(data).then(res=>{
    if(res.errno===0){
      commit(types.DELETE_IDEA,data)
    }
  })
}
/*检查登陆状态*/
export const checkStatus = function({commit,state},data){
  apiManage.checkStatus(data).then(res=>{
    //未登录
    if(res.errno===1){
      commit(types.SET_LOGIN_STATUS,false)
      commit(types.OPEN_LOGIN_DIALOG,true)
    }else{
      commit(types.SET_LOGIN_STATUS,true)
      commit(types.REDIRECT_TO,`/${data.userName}/manage`)
    }
  })
}
/*注销登陆*/
export const logout = function({commit,state},data){
  apiManage.logout(data).then(res=>{
    //注销成功
    if(res.errno===0){
      commit(types.LOG_OUT)
      commit(types.REDIRECT_TO,'/')
    }
  })
}

export const likethis = function({commit,state},data){
  return apiManage.like(data).then(res=>{
    if(res.errno===0){
      commit(types.SET_LIKELIST,res.res.likeList)
      return res
    }
  })
}

/*export const setAvatar = function({commit,state},data,config){
  console.log({commit,state},data,config)
  apiManage.setAvatar(data,config).then(res=>{
    if(res.errno===0){
      commit(types.SET_AVATAR,res.res)
    }
  })
}*/

export const socket_sendMsg = function({commit,state},data){
  commit(types.SOCKET_SEND_MSG,data)
}
//获取当前聊天对象的聊天记录
export const getChatData = function({commit,state},data){
  apiManage.getChatData(data).then(res=>{
    if(res.errno===0){
      commit(types.SET_CHAT_DATA,res.data)
    }
  })
}
//创建新收藏夹
export const createCollectList = function({commit,state},data){
  return apiManage.createCollectList(data).then(res=>{
    if(res.errno===0){
      commit(types.ADD_COLLECTLIST,{collectTitle:data.title,list:[],collectType:data.type,collectDesc:data.desc})
    }
  })
}
//添加到收藏夹
export const addToCollectList = function({commit,state},data){
  apiManage.collectBlog(data).then(res=>{
    if(res.errno===0){
      commit(types.ADD_BLOG_TO_COLLECT,data)
    }
  })
}
//删除某个收藏夹
export const deleteCollect = function({commit,state},data){
  apiManage.deleteCollectList(data).then(res=>{
    if(res.errno===0){
      commit(types.DELETE_COLLECT,data)
    }
    if(res.msg==='收藏夹不存在'){
      commit(types.DELETE_COLLECT,data)
    }
  })
}
//删除某个收藏夹中的文章
export const deleteCollectBlog = function({commit,state},data){
  apiManage.deleteCollectBlog(data).then(res=>{
    if(res.errno===0){
      commit(types.DELETE_COLLECT_BLOG,data)
    }
  })
}
