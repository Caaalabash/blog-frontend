const mongodb = require('./mongodb')
const redis = require('./redis')
const multer = require('./multer')
const alioss = require('./alioss')

module.exports = app => ({
  mongodb: mongodb(app),
  redis: redis(app),
  multer: multer(app),
  alioss: alioss(app)
})