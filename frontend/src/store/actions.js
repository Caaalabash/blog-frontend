import * as types from './mutation-type'
import apiManage from '../service/apiManage'

// 访问
export const visit = function({ commit }) {
  apiManage.visit().then(res => {
    if (res.errno === 0) {
      commit(types.SET_VIEW_COUNT, res.data)
    }
  })
}

// 登录
export const login = function({ commit, state }, data) {
  apiManage.checkUser(data).then(res => {
    if(res.errno === 0) {
      commit(types.SET_USER, res.res)
      commit(types.REDIRECT_TO, `/${res.res.userName}/manage`)
    }
  })
}

// 设置用户信息
export const setUserInfo = function({ commit }, data) {
  commit(types.SET_USER_INFO, data)
}

// 登出
export const logout = function({ commit, state }, data) {
  apiManage.logout(data).then(res => {
    if(res.errno === 0) {
      commit(types.LOG_OUT)
      commit(types.REDIRECT_TO, '/')
    }
  })
}

export const likethis = function({ commit, state }, data) {
  return apiManage.like(data).then(res => {
    if(res.errno === 0) {
      commit(types.SET_LIKELIST,res.res.likeList)
      return res
    }
  })
}

export const setAvatar = function({ commit, state }, data){
  apiManage.setAvatar(data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'userName': state.users.userName
    }
  }).then(res => {
    if(res.errno === 0) {
      commit(types.SET_AVATAR, res.res)
    }
  })
}

export const socketRecvMsg = function({ commit, state }, data) {
  commit(types.SOCKET_RECVMSG, data)
}

export const socketSendMsg = function({ commit, state }, data) {
  commit(types.SOCKET_SENDMSG, data)
}
//获取当前聊天对象的聊天记录
export const getChatData = function({ commit, state }, data) {
  apiManage.getChatData(data).then(res => {
    if(res.errno === 0) {
      commit(types.SET_CHAT_DATA, res.data)
    }
  })
}
//创建新收藏夹
export const createCollectList = function({ commit, state }, data) {
  return apiManage.createCollectList(data).then(res=>{
    if(res.errno === 0) {
      commit(types.ADD_COLLECTLIST,{ collectTitle: data.title, list: [], collectType: data.type, collectDesc: data.desc })
    }
  })
}
//添加到收藏夹
export const addToCollectList = function({ commit, state }, data) {
  apiManage.collectBlog(data).then(res => {
    if(res.errno === 0) {
      commit(types.ADD_BLOG_TO_COLLECT, data)
    }
  })
}
//删除某个收藏夹
export const deleteCollect = function({ commit, state }, data) {
  apiManage.deleteCollectList(data).then(res => {
    if(res.errno === 0) {
      commit(types.DELETE_COLLECT, data)
    }
    if(res.msg === '收藏夹不存在') {
      commit(types.DELETE_COLLECT, data)
    }
  })
}
//删除某个收藏夹中的文章
export const deleteCollectBlog = function({ commit, state }, data) {
  apiManage.deleteCollectBlog(data).then(res => {
    if(res.errno === 0) {
      commit(types.DELETE_COLLECT_BLOG, data)
    }
  })
}
