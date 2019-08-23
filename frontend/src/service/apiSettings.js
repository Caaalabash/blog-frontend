import axios from 'axios'
import { Message } from 'element-ui'

class BaseModule {
  constructor() {
    this.$http = axios.create({ timeout: 10000, baseURL: '/api' })

    this.$http.interceptors.response.use(response => {
      if (response.status === 200 && response.data.msg) {
        const type = response.data.errno ? 'error' : 'success'
        Message[type](response.data.msg)
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
