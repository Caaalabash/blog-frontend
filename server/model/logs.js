/**
 * 日志表结构
 * method: 请求方法
 * url: 请求路径
 * status: 状态码
 * responseTime: 响应时间
 * contentLength: 内容长度
 * timeStamp: 时间戳
 */
const mongoose = require('mongoose')

let logSchema = new mongoose.Schema({
  method: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  },
  status: {
    type: String,
    require: true
  },
  responseTime: {
    type: String,
    require: true,
    default: 'infinite'
  },
  contentLength: {
    type: String,
    require: true
  },
  timeStamp: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('log', logSchema)
