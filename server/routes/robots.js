const express = require('express')
const router = express.Router()

module.exports = app => {
  const { robotController } = app.controller

  // 文章页爬虫
  router.get('/:userName/articles/:blogDate', robotController.renderArticle)
  // 首页爬虫
  router.get('/:userName', robotController.renderIndex)
  // 默认处理
  router.use(robotController.renderIndex)

  return router
}
