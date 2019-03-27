const mongodb = require('./mongodb')
const redis = require('./redis')
const socket = require('./socket')
const multer = require('./multer')

module.exports = app => ({
  mongodb: mongodb(app),
  redis: redis(app),
  socket: socket(app),
  multer: multer(app)
})