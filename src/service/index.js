import axios from 'axios'
import { isEmpty } from '@/utils'
import { ElMessage, ElLoading } from 'element-plus'

const ajax = axios.create({
  timeout: 10000,
  baseURL: '/api',
  withCredentials: true,
})

ajax.interceptors.response.use((response) => {
  if (!isEmpty(response.data.message)) {
    ElMessage({
      type: response.data.code ? 'error' : 'success',
      message: response.data.message,
    })
  }
  return response.data.code ? Promise.reject(response.data) : response.data
}, (error) => {
  if (!error.config.ignoreErrorTips) {
    ElMessage({
      type: 'error',
      message: error.message,
    })
  }
  return Promise.reject(error)
})

const apis = {
  getBlogList: '/ideas',
  getBlogDetail: '/idea/:id',
  checkLoginStatus: '/user/info',
  login: '/user/login',
  logout: '/user/logout',
  createNewIdea: '/idea',
  deleteIdea: '/idea/:id',
  changeIdea: '/idea/:id',
  upload: '/idea/upload'
}

export const service = new Proxy(apis, {
  get(target, p, receiver) {
    return function (options = {}) {
      const { params = {}, loading = false, ...rest } = options
      const copyParams = { ...params }

      const url = Reflect.get(target, p, receiver)
      if (isEmpty(url)) {
        return Promise.reject('[service]: 请求路径不存在')
      }
      // 动态路由替换
      const finalUrl = url.replace(/(:\w+)/g, (_, p) => {
        const key = p.slice(1)
        const val = copyParams[key]
        delete copyParams[key]
        return val
      })
      let loadingInstance = null
      if (loading) {
        loadingInstance = ElLoading.service({})
      }
      return ajax(finalUrl, {
        params: copyParams,
        ...rest,
      }).finally(() => {
        loadingInstance && loadingInstance.close()
      })
    }
  },
})
