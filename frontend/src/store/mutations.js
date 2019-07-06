import * as types from './mutation-type'
import router from '../router'

const mutations = {
  // 路由跳转
  [types.REDIRECT_TO](state, path) {
    state.redirectTo = path
    router.push(path)
  },
  // 登录相关
  [types.SET_TOKEN](state, payload) {
    state.token = payload
  },
  [types.SET_LOGIN_STATUS](state, payload) {
    state.loginStatus = payload
  },
  [types.SET_USER](state, data) {
    state.users = data
  },
  [types.SET_USER_INFO](state, data) {
    state.users.userInfo = data
  },
  [types.LOG_OUT](state) {
    const initState = state.initState()
    for (const key in initState) {
      state[key] = initState[key]
    }
  },
  // 设置喜欢列表
  [types.SET_LIKELIST](state, data) {
    state.users.likeList = data
  },
  [types.SET_COLLECTLIST](state, data) {
    state.users.collectList = data
  },
  [types.ADD_COLLECTLIST](state, data) {
    state.users.collectList.push(data)
  },
  [types.ADD_BLOG_TO_COLLECT](state, data) {
    let index = state.users.collectList.findIndex(item => item.collectTitle === data.collect)
    state.users.collectList[index].list.push({
        author: data.author,
        blogDate: data.blogDate,
      })
  },
  [types.DELETE_COLLECT](state, data) {
    let index = state.users.collectList.findIndex(item => item.collectTitle === data.collectTitle)
    if(index !== -1) {
      state.users.collectList.splice(index,1)
    }
  },
  [types.DELETE_COLLECT_BLOG](state, data) {
    let index = state.users.collectList.findIndex(item => item.collectTitle === data.collectTitle)
    if(index !== -1) {
      let i = state.users.collectList[index].list.findIndex(item => item.blogDate === data.blogDate)
      state.users.collectList[index].list.splice(i,1)
    }
  },
  [types.SET_AVATAR](state, data) {
    state.users.avatar = data
  },
  // 聊天相关
  [types.SET_CHAT_DATA](state, data) {
    state.message = data
  },
  [types.SOCKET_CONNECT](state) {
    state.connect = true
  },
  [types.SOCKET_SENDMSG](state, data) {
    state.message.push(data)
  },
  [types.SOCKET_RECVMSG](state, data) {
    if (data.from === state.users.userName) return
    state.message.push(data)
  },
  [types.SET_VIEW_COUNT](state, data) {
    state.viewCount = data
  }
}
export default  mutations
