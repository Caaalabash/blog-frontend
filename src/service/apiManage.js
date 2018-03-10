import BaseModule from './apiSettings.js'

/*因为规模不大 全部写在一个js中好了- -*/
class apiManage extends BaseModule {
  constructor() {
    super()
  }
  //登录注册
  createUser(obj){
    return  this.$http.post('createUser',obj)
  }
  checkUser(obj){
    return this.$http.post('checkUser',obj)
  }
  //获取用户信息
  getUserInfo(obj){
    return this.$http.post('getUserInfo',obj)
  }
  //修改用户信息
  changeUserInfo(obj){
    return this.$http.post('changeUserInfo',obj)
  }
  //发送新博文
  createNewIdea(obj){
    return this.$http.post('createNewIdea',obj)
  }
  //删除博客
  deleteIdea(obj){
    return this.$http.post('deleteIdea',obj)
  }
  //修改博文
  changeIdea(obj){
    return this.$http.post('changeIdea',obj)
  }
  //查找博文
  findIdea(obj){
    return this.$http.post('findIdea',obj)
  }
  //获取博文列表
  getIdeaList(obj){
    return this.$http.post('getIdeaList',obj)
  }
  //获取某一个文章
  getIdea(obj){
    return this.$http.post('getIdea',obj)
  }
}
export default new apiManage()
