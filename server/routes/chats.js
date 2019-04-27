const express = require('express')
const router = express.Router()
const _ = require('underscore')

const { cors } = require('../middleware')

module.exports = app => {
  const chatController = require('../controller/chat')(app)
  const { multer } = app.blog_extend
  const { chatModel } = app.model

  router.use(cors)
  // 增加聊天对象
  router.post('/chatList', chatController.addChatObj)
  // 获取聊天列表(对象以及头像地址)
  router.get('/chatList', chatController.getChatList)
  // 获取与某一个人的聊天数据(最近五十条)
  router.get('/chatData', chatController.getChatData)
  // 聊天图片上传
  router.post('/chatPic', multer.single('chat'), chatController.uploadPic)
  // 聊天语音上传
  router.post('/chatVoice', multer.single('audio'), chatController.uploadVoice)
  // socket
  app.io = io => {
    io.on('connection', socket => {

      socket.on('online', data => {
        console.log(`[socket]: 用户${data}连接成功`)
        socket.name = data
      })
      socket.on('disconnecting', reason => {
        console.log(`[socket]: 用户${socket.name}断开了连接: ${reason}`)
      })

      socket.on('sendMsg', async data => {
        const { from, to } = data
        const chatid = [from, to].sort().join('_')
        const toObj = _.findWhere(io.sockets.sockets, { name: to })
        await chatModel.create({ chatid, ...data })

        if (toObj) {
          toObj.emit('recvMsg', { chatid, ...data })
        }
      })
    })

    return io
  }
  return router
}
