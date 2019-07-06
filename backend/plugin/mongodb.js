const mongoose = require('mongoose')

module.exports = app => {
  const { mongodb } = app.app_config

  mongoose.connect(mongodb.url)

  mongoose.connection.on('connected', function() {
    console.log('mongodb连接成功')
  })

  mongoose.connection.on('error', function() {
    console.log('mongodb连接失败')
  })

  mongoose.connection.on('disconnected', function() {
    console.log('mongodb连接断开')
  })
  return mongoose
}
