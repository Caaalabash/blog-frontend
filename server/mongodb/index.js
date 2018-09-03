const mongoose = require('mongoose')
const config = require('../config/config')

mongoose.connect(config.database)

mongoose.connection.on("connected",function(){
  console.log("连接成功")
})

mongoose.connection.on("error",function(){
  console.log("连接失败")
})

mongoose.connection.on("disconnected",function(){
  console.log("连接断开")
})

module.exports = mongoose
