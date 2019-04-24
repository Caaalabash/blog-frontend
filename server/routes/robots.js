const express = require('express')
const router = express.Router()

module.exports = app => {
  const robotController = require('../controller/robot')(app)

  router.get('/:userName/articles/:blogDate', robotController.renderArticle)

  router.get('/:userName', robotController.renderIndex)

  router.use(robotController.renderIndex)

  return router
}
