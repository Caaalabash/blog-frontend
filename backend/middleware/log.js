/**
 * 日志中间件: 将请求日志记录到数据库
 */
const logger = require('morgan')

module.exports = {
  log: app => {
    const { apiController } = app.controller
    const dbStream = {
      write(line) {
        apiController.insertLog(JSON.parse(line))
      }
    }
    return logger(function(tokens, req, res) {
      // tokens就是morgan, 此处指定日志格式
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseTime: tokens['response-time'](req, res),
        contentLength: res['content-length'],
        timeStamp: Date.parse(tokens.date(req, res))
      })
    }, { stream: dbStream })
  }
}