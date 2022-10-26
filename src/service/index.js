import axios from 'axios'
import { isEmpty } from '@/utils'

const ajax = axios.create({
  timeout: 1000,
  baseURL: '/api',
  withCredentials: true,
})

ajax.interceptors.response.use((response) => {
  return response.data
})

const apis = {
  getBlogList: '/ideas',
  getBlogDetail: '/idea/:id',
}

export const service = new Proxy(apis, {
  get(target, p, receiver) {
    return function (options = {}) {
      const { params = {}, ...rest } = options
      const copyParams = { ...params }

      const url = Reflect.get(target, p, receiver)
      if (isEmpty(url)) {
        return Promise.reject('[service]: 请求路径不存在')
      }

      // 动态路由替换
      url.replace(/(:\w+)/g, (_, p1) => {
        const key = p.slice(1)
        const val = copyParams[key]
        delete copyParams[key]
        return val
      })

      return ajax(url, {
        params: copyParams,
        ...rest,
      })
    }
  },
})
