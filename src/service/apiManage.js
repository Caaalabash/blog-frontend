import BaseModule from './index'

class apiManage extends BaseModule {
  constructor() {
    super()
  }
  login(payload) {
    return this.post('https://remake.calabash.top/user/login', payload)
  }
  logout() {
    return this.get('https://remake.calabash.top/user/logout')
  }
  getUserInfo() {
    return this.get('https://remake.calabash.top/user/info')
  }
  // 发送新博文
  createNewIdea(obj) {
    return this.post('https://remake.calabash.top/idea', obj)
  }
  // 删除博客
  deleteIdea(id) {
    return this.delete(`https://remake.calabash.top/idea/${id}`)
  }
  // 修改博文
  changeIdea(obj) {
    const { id, ...data } = obj
    return this.put(`https://remake.calabash.top/idea/${id}`, data)
  }
  // 获取某一个文章
  getIdea(id) {
    return this.get(`https://remake.calabash.top/idea/${id}`)
  }
  // 获取博文列表
  getIdeaList(obj) {
    return this.get('https://remake.calabash.top/ideas', obj)
  }
  upload(obj, config) {
    return this.post('https://remake.calabash.top/idea/upload', obj, config)
  }
}
export default new apiManage()
