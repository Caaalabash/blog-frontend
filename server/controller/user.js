const redisTool = require('../lib/token')
const users = require('../model/users')
const pushMessage = require('../webpush/index')
const {response} = require('../lib/tool')


//注册
async function register(req,res){
  let {userName}= req.body
  let user = await users.findOne({'userName':userName})
  if(user){
    return res.json(response(1,'','该昵称已被占用'))
  }else{
    let createUser = await users.create(req.body)
    return createUser
      ? res.json(response(0,'','注册成功'))
      : res.json(response(1,'','注册失败'))
  }
}
//登录
async function login(req,res){
  let userName = req.body.userName
  let user = await users.findOne(req.body,{'userPwd':0,'__v':0,'blogList':0})
  if(user){
    let tokenVal = await redisTool.sign(userName)
    user.blogList = []
    return res.json(response(0,user,'登录成功',tokenVal))
  }else{
    return res.json(response(1,'','用户名或密码错误'))
  }
}
//注销
function logout(req,res){
  let { userName } = req.body
  redisTool._delete(userName).then(result=>{
    if(result===1 || result ===0){
      return res.json(response(0,'','注销成功'))
    }else{
      return res.json(response(1,'','凭证已过期'))
    }
  })
}
//检查token
function checkStatus(req,res){
  return res.json(response(0,'',''))
}
//修改个人信息
async function updateUserInfo(req,res){
  let {userName,userInfo} = req.body
  users.update({"userName":userName},{$set:{userInfo:userInfo}},function (e,doc) {
    if(e){
      return res.json(response(1,'','修改失败'))
    }
    return res.json(response(0,'','修改成功'))
  })
}
//获取个人信息
async function getUserInfo(req,res){
  users.find({"userName":req.query.userName},{"_id":0,"userInfo":1},function (e,doc) {
    if(e){
      return res.json(response(1,'',''))
    }
    return res.json(response(0,doc[0].userInfo,''))
  })
}
//图片上传
async function uploadPic(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  return res.json(response(0,path,''))
}
//头像上传
async function uploadAvatar(req,res){
  let path = `https://blog.calabash.top/${req.file.filename}`
  let userName = req.headers['username']
  await users.update({"userName":userName},{$set:{avatar:path}})
  return res.json(response(0,path,'设置成功'))
}
//获取ip地址
async function getIP(req,res){
  let date= req.query.date
  let result = await redisTool.getIpLog(date)
  return res.json(response(0,result,''))
}
//推送
async function push(req,res){
  let data = req.body
  await sendNotification(data)
  return res.json(response(0,'',''))
}
//遍历推送
async function sendNotification(data){
  let list = await redisTool.getSubscription('subscription')
  for(let n of list){
    let res = await pushMessage(n,JSON.stringify(data))
    if(typeof res === 'string'){
      redisTool.removeSubscription(res)
    }
  }
}
//创建收藏夹
async function createCollect(req,res){
  let {userName,...obj} = req.body
  users.find({"userName":userName,"collectList.collectTitle":obj.title},async function (e,doc) {
    if(doc.length>=1){
      return res.json(response(1,'','该收藏夹已存在'))
    }
    await users.update({"userName":userName},{$push:{"collectList":{
          'collectTitle':obj.title,
          'collectType':obj.type,
          'collectDesc':obj.desc,
          "list":[]
        }
    }})
    return res.json(response(0,'','创建成功'))
  })
}
//删除收藏夹
async function deleteCollect(req,res){
  let {collectTitle,userName} = req.body
  users.update({"userName":userName},{$pull:{"collectList":{"collectTitle":collectTitle}}},function (e,doc) {
    if(e){
      return res.json(response(1,'','删除失败'))
    }
    return res.json(response(0,'','删除成功'))
  })
}

//收藏 这里为两层嵌套结构查询有点困难
async function collect(req,res){
  let {userName,author,blogDate,collect} = req.body
  let user = await users.findOne({'userName':userName})
  if(user){
    let index = user.collectList.findIndex(item=>item.collectTitle===collect)
    if(user.collectList[index].list.some(item=>item.blogDate===blogDate)){
      return res.json(response(1,'','已收藏该文章'))
    }
    user.collectList[index].list.push({author,blogDate})
    await user.save()
    return res.json(response(0,'','收藏成功'))
  }else{
    return res.json(response(1,'','没有该用户'))
  }

}
//删除收藏夹中某个文章
async function deleteCollectBlog(req,res){
  let {userName} = req.body
  let user = await users.findOne({'userName':userName})
  if(user){
    let index = user.collectList.findIndex(item=>item.collectTitle===req.body.collectTitle)
    if(index !== -1){
      let i = user.collectList[index].list.findIndex(item=>item.blogDate===req.body.blogDate && item.author===req.body.author)
      if(i !== -1){
        user.collectList[index].list.splice(i,1)
        await user.save()
        return res.json(response(0,'','删除成功'))
      }else{
        return res.json(response(1,'','收藏夹中不存在该文章'))
      }
    }else{
      return res.json(response(1,'','收藏夹不存在'))
    }
  }else{
    return res.json(response(1,'','没有该用户'))
  }

}

module.exports = {
  register,
  login,
  logout,
  checkStatus,
  updateUserInfo,
  getUserInfo,
  uploadPic,
  uploadAvatar,
  getIP,
  push,
  collect,
  createCollect,
  deleteCollect,
  deleteCollectBlog
}
