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
