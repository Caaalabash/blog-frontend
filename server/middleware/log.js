const logger = require('morgan')

module.exports = {
  log: app => {
    const api = require('../controller/api')(app)
    const dbStream = {
      write(line){
        api.insertLog(JSON.parse(line))
      }
    }
    return logger(function(tokens, req, res) {
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