import BaseModule from './apiSettings'

class apiManage extends BaseModule {
  constructor() {
    super()
  }
  // 访问
  visit() {
    return this.post('v3/visit')
  }
  // 注册
  createUser(obj) {
    return this.post('v1/register', obj)
  }
  // 登录
  checkUser(obj) {
    return this.post('v1/login', obj)
  }
  // 获取管理菜单
  getMenu() {
    return this.get('v1/menu')
  }
  // 注销登录
  logout(obj) {
    return this.post('v1/logout', obj)
  }
  // 检查登录状态
  checkStatus(obj) {
    return this.post('v1/checkStatus', obj)
  }
  // 修改用户信息
  changeUserInfo(obj) {
    return this.put('v1/userinfo', obj)
  }
  // 获取用户信息
  getUserInfo(obj) {
    return this.get('v1/userinfo', obj)
  }
  // 发送新博文
  createNewIdea(obj) {
    return this.post('v1/ideas', obj)
  }
  // 删除博客
  deleteIdea(obj) {
    const { blogDate, ...data } = obj
    const url = `v1/ideas/${blogDate}`
    return this.delete(url, { data })
  }
  // 修改博文
  changeIdea(obj) {
    const { blogDate, ...data } = obj
    const url = `v1/ideas/${blogDate}`
    return this.put(url, data)
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
    return this.post('v1/files', obj, config)
  }
  // 获取pv
  getPv(obj) {
    return this.get('v3/ip', obj)
  }
  // 发布评论
  postComment(obj) {
    return this.post('v1/comment', obj)
  }
  // 获取评论
  getComment(obj) {
    return this.get('v1/comment', obj)
  }
  // 喜欢/取消喜欢
  like(obj) {
    return this.post('v1/like', obj)
  }
  // 设置头像
  setAvatar(obj, config) {
    return this.post('v1/avatar', obj, config)
  }
  // 获取收藏夹
  getCollectList(obj, config) {
    return this.get('v1/collectList', obj, config)
  }
  // 创建收藏夹
  createCollectList(obj, config) {
    return this.post('v1/collectList', obj, config)
  }
  // 删除收藏夹
  deleteCollectList(obj) {
    return this.delete('v1/collectList', { data: obj })
  }
  // 删除收藏夹中的某个文章
  deleteCollectBlog(obj) {
    return this.delete('v1/collect', { data: obj })
  }
  // 收藏
  collectBlog(obj, config) {
    return this.post('v1/collect', obj, config)
  }
  subscription(obj) {
    return this.post('v1/subscription', obj)
  }
  getChatData(obj) {
    return this.get('v2/chatData', obj)
  }
  getChatList(obj) {
    return this.get('v2/chatList', obj)
  }
  addChatObj(obj) {
    return this.post('v2/chatList', obj)
  }
  uploadChatPic(obj, config) {
    return this.post('v2/chatPic',obj,config)
  }
  // 语音消息
  uploadVoiceMsg(obj, config) {
    return this.post('v2/chatVoice', obj, config)
  }
  getApiMonitor(obj, config) {
    return this.post('v3/monitor', obj, config)
  }
  getPvMonitor(obj, config) {
    return this.get('v3/pv', obj, config)
  }
  getAnalyzeBlogDate(obj, config) {
    return this.get('v3/analyzeBlogDate', obj, config)
  }
}
export default new apiManage()
