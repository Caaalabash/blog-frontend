const express = require('express')
const router = express.Router()
const upload = require('../multer/index')
const mongoose = require('../mongodb/index')
const middleware = require('../middleware/index')
const userController = require('../controller/user')
const blogController = require("../controller/blog")
router.use(middleware.cors)
//记录IP
router.use(middleware.collectIP)
//中间件:包含在validToken数组中的路径需要先验证token是否正确
router.use(middleware.validateToken)


//注册功能
router.post('/register',userController.register);
//登录功能
router.post('/login',userController.login);
//注销登陆
router.post('/logout',userController.logout)
//检查token
router.post('/checkStatus',userController.checkStatus)
//修改个人信息
router.put('/userinfo',userController.updateUserInfo)
//获取个人信息
router.get('/userinfo',userController.getUserInfo)
//发布博客功能
router.post('/ideas',blogController.createBlog)
//删除某一篇文章
router.delete('/ideas/:blogDate',blogController.deleteBlog)
//修改某一篇文章
router.put('/ideas/:blogDate',blogController.updateBlog)
//获取某一篇文章
router.get('/ideas/:blogDate',blogController.getBlog)
//获取文章列表
router.get('/ideas',blogController.getBlogList)
//图片上传
router.post('/files',upload.single('file'),userController.uploadPic)
//头像上传
router.post('/avatar',upload.single('avatar'),userController.uploadAvatar)
//获取IP地址
router.get('/pv',userController.getIP)
//评论
router.post('/comment',blogController.postComment)
//获取评论
router.get('/comment',blogController.getComment)
//应该用redis俩搞,设计之初没有计划好,现在已经比较混乱了
//喜欢/取消喜欢某文章
router.post('/like',blogController.likeBlog)
//web push
router.post('/subscription',blogController.subscription)
//推送
router.post('/push',userController.push)
//收藏
router.post('/collect',userController.collect)
//创建收藏夹
router.post('/collectList',userController.createCollect)
//删除收藏夹
router.delete('/collectList',userController.deleteCollect)
//删除收藏夹中某个博客
router.delete('/collect',userController.deleteCollectBlog)

module.exports = {
  users:router
};
