const express = require('express')
const router = express.Router()

const { collectIP, validate } = require('../middleware')

module.exports = app => {
  const { blogController, userController } = app.controller
  const { multer } = app.plugin
  const validateMiddleware = validate(app)
  const requestMiddleware = collectIP(app)
  /**
   * 鉴权相关
   */
  router.post('/register', requestMiddleware, userController.register)
  router.post('/login', requestMiddleware, userController.login)
  router.post('/logout', requestMiddleware, userController.logout)
  router.post('/checkStatus', validateMiddleware, userController.checkStatus)
  router.get('/menu', userController.getMenu)
  /**
   * 文章相关
   */
  router.post('/ideas', validateMiddleware, blogController.createBlog)
  router.delete('/ideas/:blogDate', validateMiddleware, blogController.deleteBlog)
  router.put('/ideas/:blogDate', validateMiddleware, blogController.updateBlog)
  router.get('/ideas/:blogDate', requestMiddleware, blogController.getBlog)
  router.get('/ideas', blogController.getBlogList)
  router.post('/comment', requestMiddleware, validateMiddleware, blogController.postComment)
  router.get('/comment', blogController.getComment)
  router.post('/like', requestMiddleware, validateMiddleware, blogController.likeBlog)
  router.post('/collect', validateMiddleware, userController.collect)
  router.post('/files', validateMiddleware, multer.single('file'), userController.uploadPic)
  /**
   * 个人信息相关
   */
  router.put('/userinfo', validateMiddleware, userController.updateUserInfo)
  router.get('/userinfo', userController.getUserInfo)
  router.post('/collectList', validateMiddleware, userController.createCollect)
  router.delete('/collectList', validateMiddleware, userController.deleteCollect)
  router.delete('/collect', validateMiddleware, userController.deleteCollectBlog)
  router.post('/avatar', validateMiddleware, multer.single('avatar'), userController.uploadAvatar)

  return router
}
