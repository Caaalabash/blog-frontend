const express = require('express')
const router = express.Router()

module.exports = app => {
  const apiController = require('../controller/api')(app)

  router.post('/monitor', apiController.getLogByUrl)
  router.get('/pv', apiController.getPvLog)
  router.get('/analyzeBlogDate', apiController.analyzeBlogDate)
  router.post('/sendMyLove', apiController.sendMyLove)

  return router
}
