const express = require('express')
const router = express.Router()

module.exports = app => {
  const { robotController } = app.controller

  /**
   * 为爬虫渲染首页/文章详情页
   */
  router.get('/:userName/articles/:blogDate', robotController.renderArticle)
  router.get('/:userName', robotController.renderIndex)
  router.use(robotController.renderIndex)

  return router
}
