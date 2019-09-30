import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import apiManage from './service/apiManage'

Vue.use(Vuex)

const initState = {
  users: {},
  redirectTo: '',
  connect: false,
  message: [],
  viewCount: 0
}

export default new Vuex.Store({
  state: {
    ...initState,
    initState() {
      return initState
    }
  },
  getters: {
    users(state) {
      return state.users
    },
    userName(state) {
      return state.users.userName
    },
    userInfo(state) {
      return state.users.userInfo
    },
    avatar(state) {
      return state.users.avatar || ''
    },
    message(state) {
      return state.message || []
    }
  },
  mutations: {
    'REDIRECT_TO'(state, path) {
      state.redirectTo = path
      router.push(path)
    },
    'SET_USER'(state, data) {
      state.users = data
    },
    'SET_USER_INFO'(state, data) {
      state.users.userInfo = data
    },
    'LOG_OUT'(state) {
      const initState = state.initState()
      for (const key of Object.keys(initState)) {
        state[key] = initState[key]
      }
    },
    'SET_AVATAR'(state, data) {
      state.users.avatar = data
    },
    'SET_CHAT_DATA'(state, data) {
      state.message = data
    },
    'SOCKET_CONNECT'(state) {
      state.connect = true
    },
    'SOCKET_SENDMSG'(state, data) {
      state.message.push(data)
    },
    'SOCKET_RECVMSG'(state, data) {
      if (data.from === state.users.userName) return
      state.message.push(data)
    },
    'SET_VIEW_COUNT'(state, data) {
      state.viewCount = data
    }
  },
  actions: {
    initStatus({ commit }) {
      apiManage.checkStatus().then(res => {
        if (res.errno === 0) {
          commit('SET_USER', res.data)
        }
      })
    },
    visit({ commit }) {
      apiManage.visit().then(res => {
        if (res.errno === 0) {
          commit('SET_VIEW_COUNT', res.data)
        }
      })
    },
    login({ commit, state }, data) {
      apiManage.checkUser(data).then(res => {
        if(res.errno === 0) {
          commit('SET_USER', res.data)
          commit('REDIRECT_TO', `/admin/new`)
        }
      })
    },
    setUserInfo({ commit }, data) {
      commit('SET_USER_INFO', data)
    },
    logout({ commit, state }, data) {
      apiManage.logout(data).then(res => {
        if(res.errno === 0) {
          commit('LOG_OUT')
          commit('REDIRECT_TO', '/')
        }
      })
    },
    setAvatar({ commit, state }, data){
      apiManage.setAvatar(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'userName': state.users.userName
        }
      }).then(res => {
        if(res.errno === 0) {
          commit('SET_AVATAR', res.data)
        }
      })
    },
    socketRecvMsg({ commit, state }, data) {
      commit('SOCKET_RECVMSG', data)
    },
    socketSendMsg({ commit, state }, data) {
      commit('SOCKET_SENDMSG', data)
    },
    getChatData({ commit, state }, data) {
      apiManage.getChatData(data).then(res => {
        if(res.errno === 0) {
          commit('SET_CHAT_DATA', res.data)
        }
      })
    }
  }
})
