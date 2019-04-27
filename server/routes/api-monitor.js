const express = require('express')
const router = express.Router()

module.exports = app => {
  const { apiController } = app.controller

  // 获取最近十天访问量
  router.post('/monitor', apiController.getLogByUrl)
  // 获取访问日志
  router.get('/pv', apiController.getPvLog)
  // 分析博客发布时间
  router.get('/analyzeBlogDate', apiController.analyzeBlogDate)
  // 女票翻译需求
  router.post('/sendMyLove', apiController.sendMyLove)

  return router
}
