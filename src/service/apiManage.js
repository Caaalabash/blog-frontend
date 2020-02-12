import BaseModule from './index'

class apiManage extends BaseModule {
  constructor() {
    super()
  }
  login(payload) {
    return this.post('/user/login', payload)
  }
  logout() {
    return this.get('/user/logout')
  }
  getUserInfo() {
    return this.get('/user/info')
  }
  // 发送新博文
  createNewIdea(obj) {
    return this.post('/idea', obj)
  }
  // 删除博客
  deleteIdea(id) {
    return this.delete(`/idea/${id}`)
  }
  // 修改博文
  changeIdea(obj) {
    const { id, ...data } = obj
    return this.put(`/idea/${id}`, data)
  }
  // 获取某一个文章
  getIdea(id) {
    return this.get(`/idea/${id}`)
  }
  // 获取博文列表
  getIdeaList(obj) {
    return this.get('/ideas', obj)
  }
  upload(obj, config) {
    return this.post('/idea/upload', obj, config)
  }
}
export default new apiManage()
