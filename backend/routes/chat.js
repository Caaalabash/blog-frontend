const express = require('express')
const router = express.Router()
const _ = require('underscore')

module.exports = app => {
  const { chatController } = app.controller
  const { multer } = app.plugin
  const { chatModel } = app.model

  /**
   * 聊天接口
   */
  router.post('/chatList', chatController.addChatObj)
  router.get('/chatList', chatController.getChatList)
  router.get('/chatData', chatController.getChatData)
  router.post('/chatPic', multer.single('chat'), chatController.uploadPic)
  router.post('/chatVoice', multer.single('audio'), chatController.uploadVoice)
  /**
   * Socket连接事件处理
   */
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
