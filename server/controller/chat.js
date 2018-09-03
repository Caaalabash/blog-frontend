const _ = require('underscore')
const chats = require('../model/chats')
const {getUserProp,rsp } = require('../lib/tool')


//增加聊天对象
async function addChatObj(req,res){
  const user = req.body.user
  let data = await getUserProp(user,'avatar')
  if(data){
    return res.json(rsp(0,{to:user,avatar:data},''))
  }
  return res.json(rsp(1,'','没有该用户'))
}
//获取聊天列表
async function getChatList(req,res){
  const user = req.query.user
  let doc = await chats.find({},{_id:0,chatid:1})
  if(doc){
    let list = doc.reduce((acc,item,index)=>{
      if(item.chatid.includes(user)){
        acc.push(item.chatid)
      }
      return acc
    },[])
    let data = []
    let arr = [...new Set(list)]
    for(let n of arr){
      let [from,to] = n.split('_')
      let obj = from === user ? to : from
      let avatar = await getUserProp(obj,'avatar')
      data.push({
        to:obj,
        avatar:avatar
      })
    }
    return res.json(rsp(0,data,''))
  }
}
//获取与某个人的50条聊天数据
function getChatData(req,res){
  const chatid = req.query.chatid
  chats.find({chatid},{_id:0,__v:0},function(err,doc){
    return res.json(rsp(0,doc.slice(-50),''))
  })
}
//聊天图片上传
function uploadPic(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(rsp(0,path,''))
}
//聊天语音上传
function uploadVoice(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(rsp(0,path,''))
}


module.exports = {
  addChatObj,
  getChatList,
  getChatData,
  uploadPic,
  uploadVoice
}
