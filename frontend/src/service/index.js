import axios from 'axios'
import { Message } from 'element-ui'

class BaseModule {
  constructor() {
    this.$http = axios.create({ timeout: 10000, baseURL: '/api', withCredentials: true })

    this.$http.interceptors.response.use(response => {
      if (response.status === 200 && response.data.msg) {
        // NodeJS接口 Golang接口兼容
        if (response.data.msg) {
          Message[response.data.errno ? 'error' : 'success'](response.data.msg)
        } else if (response.data.message) {
          Message[response.data.code ? 'error' : 'success'](response.data.message)
        }
      }
      return response.data
    }, error => {
      Message.error('响应出错')
      return Promise.resolve(error)
    })
  }
  get(url, data = {}, config = {}) {
    return this.$http.get(url, { params: data, ...config })
  }
  post(url, data = {}, config = {}) {
    return this.$http.post(url, data, config)
  }
  put(url, data = {}, config = {}) {
    return this.$http.put(url, data, config)
  }
  delete(url, config = {}) {
    return this.$http.delete(url, config)
  }
}

export default BaseModule
