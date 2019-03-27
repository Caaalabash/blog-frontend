const mongoose = require('mongoose')

let chatSchema = new mongoose.Schema({
  chatid: {
    type: String,
    require: true
  },
  from: {
    type: String,
    require: true
  },
  to: {
    type: String,
    require: true
  },
  read: {
    type: Boolean,
    require: true,
    default: false
  },
  content: {
    type: String,
    require: true
  },
  timeStamp: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('chat', chatSchema)
