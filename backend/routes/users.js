const express = require('express')
const router = express.Router()

const { cors, collectIP, validate } = require('../middleware')

module.exports = app => {
  const { blogController, userController } = app.controller
  const { multer } = app.plugin
  const validateMiddleware = validate(app)
  // 允许跨域
  router.use(cors)
  // 记录IP
  router.use(collectIP(app))
  // 注册功能
  router.post('/register', userController.register)
  // 登录功能
  router.post('/login', userController.login)
  // 注销登陆
  router.post('/logout', userController.logout)
  // 检查状态
  router.post('/checkStatus', validateMiddleware, userController.checkStatus)
  // 修改个人信息
  router.put('/userinfo', validateMiddleware, userController.updateUserInfo)
  // 获取个人信息
  router.get('/userinfo', userController.getUserInfo)
  // 发布博客功能
  router.post('/ideas', validateMiddleware, blogController.createBlog)
  // 删除某一篇文章
  router.delete('/ideas/:blogDate', validateMiddleware, blogController.deleteBlog)
  // 修改某一篇文章
  router.put('/ideas/:blogDate', validateMiddleware, blogController.updateBlog)
  // 获取某一篇文章
  router.get('/ideas/:blogDate', blogController.getBlog)
  // 获取文章列表
  router.get('/ideas', blogController.getBlogList)
  // 图片上传
  router.post('/files', validateMiddleware, multer.single('file'), userController.uploadPic)
  // 头像上传
  router.post('/avatar', validateMiddleware, multer.single('avatar'), userController.uploadAvatar)
  // 获取IP地址
  router.get('/pv', userController.getIP)
  // 评论
  router.post('/comment', validateMiddleware, blogController.postComment)
  // 获取评论
  router.get('/comment', blogController.getComment)
  // 喜欢/取消喜欢某文章
  router.post('/like', validateMiddleware, blogController.likeBlog)
  // 收藏
  router.post('/collect', validateMiddleware, userController.collect)
  // 创建收藏夹
  router.post('/collectList', validateMiddleware, userController.createCollect)
  // 删除收藏夹
  router.delete('/collectList', validateMiddleware, userController.deleteCollect)
  // 删除收藏夹中某个博客
  router.delete('/collect', validateMiddleware, userController.deleteCollectBlog)
  // Test
  router.get('/header', (req, res) => {
    return res.json({
      data: JSON.stringify(req.headers)
    })
  })

  return router
}
