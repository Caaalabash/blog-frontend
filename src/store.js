import Vue from 'vue'
import Vuex from 'vuex'
import apiManage from './service/apiManage'

Vue.use(Vuex)

const SET_USER = 'SET_USER'

export default new Vuex.Store({
  state: {
    user: {}
  },
  getters: {

  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async login({ commit }, payload) {
      const r = await apiManage.login(payload).catch(() => {})
      if (r && r.code === 0) {
        commit(SET_USER, r.data)
      }
    },
    async getUserInfo({ commit }) {
      const r = await apiManage.getUserInfo().catch(() => {})
      if (r && r.code === 0) {
        commit(SET_USER, r.data)
      }
    },
    async logout({ commit }) {
      const r = await apiManage.logout().catch(() => {})
      if (r && r.code === 0) {
        commit(SET_USER, {})
      }
    }
  }
})
