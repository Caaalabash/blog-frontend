const express = require('express')
const _ = require('underscore')
const router = express.Router()
const upload = require('../multer/index')
const chatController = require('../controller/chat')
const middleware = require('../middleware/index')
const chats = require('../model/chats')

router.use(middleware.cors)

router.post('/chatList',chatController.addChatObj)
//获取聊天列表(对象以及头像地址)
router.get('/chatList',chatController.getChatList)
//获取与某一个人的聊天数据(最近五十条)
router.get('/chatData',chatController.getChatData)
//聊天图片上传
router.post('/chatPic',upload.single('chat'),chatController.uploadPic)
//聊天语音上传
router.post('/chatVoice',upload.single('audio'),chatController.uploadVoice)
//socket
router.io = function (io) {
  io.on('connection', function (socket,data) {
    console.log('connected');

    socket.on('online',function(data){
      socket.name = data
    })

    socket.on('sendMsg',function(data){
      const {from,to,content} = data
      const chatid = [from,to].sort().join('_')
      chats.create({chatid,...data},function(err,doc){
        if(!err){
          let {_id,__v,...data} = doc._doc
          let toObj = _.findWhere(io.sockets.sockets,{name:to})
          if(toObj){
            toObj.emit('recvMsg',data)
          }
        }
      })
    })
  });

  return io;
}


module.exports = router;
