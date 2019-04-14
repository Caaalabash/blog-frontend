/**
 * 聊天表结构
 * chatid: 聊天索引, 由双方索引组成
 * from: 发消息方
 * to: 收消息方
 * read: 是否已读(未实现)
 * content: 消息内容(未加密)
 * timeStamp: 时间戳
 */
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
