const express = require('express')
const router = express.Router()

const { cors, collectIP, validateToken } = require('../middleware')

module.exports = app => {
  const userController = require('../controller/user')(app)
  const blogController = require('../controller/blog')(app)
  const { multer } = app.blog_extend

  // 允许跨域
  router.use(cors)
  // 记录IP
  router.use(collectIP(app))
  // 中间件:包含在validToken数组中的路径需要先验证token是否正确
  router.use(validateToken(app))
  // 注册功能
  router.post('/register', userController.register)
  // 登录功能
  router.post('/login', userController.login)
  // 注销登陆
  router.post('/logout', userController.logout)
  // 检查token
  router.post('/checkStatus', userController.checkStatus)
  // 修改个人信息
  router.put('/userinfo', userController.updateUserInfo)
  // 获取个人信息
  router.get('/userinfo', userController.getUserInfo)
  // 发布博客功能
  router.post('/ideas', blogController.createBlog)
  // 删除某一篇文章
  router.delete('/ideas/:blogDate', blogController.deleteBlog)
  // 修改某一篇文章
  router.put('/ideas/:blogDate', blogController.updateBlog)
  // 获取某一篇文章
  router.get('/ideas/:blogDate', blogController.getBlog)
  // 获取文章列表
  router.get('/ideas', blogController.getBlogList)
  // 图片上传
  router.post('/files', multer.single('file'), userController.uploadPic)
  // 头像上传
  router.post('/avatar', multer.single('avatar'), userController.uploadAvatar)
  // 获取IP地址
  router.get('/pv', userController.getIP)
  // 评论
  router.post('/comment', blogController.postComment)
  // 获取评论
  router.get('/comment', blogController.getComment)
  // 喜欢/取消喜欢某文章
  router.post('/like', blogController.likeBlog)
  // 收藏
  router.post('/collect', userController.collect)
  // 创建收藏夹
  router.post('/collectList', userController.createCollect)
  // 删除收藏夹
  router.delete('/collectList', userController.deleteCollect)
  // 删除收藏夹中某个博客
  router.delete('/collect', userController.deleteCollectBlog)

  return router
}
