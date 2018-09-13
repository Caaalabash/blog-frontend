const redisTool = require('../lib/token')
const blog = require('../model/articles')
const users = require("../model/users")
const pushMessage = require('../webpush/index')
const {response,getUserProp} = require('../lib/tool')
const filter = require("../lib/filter")

//发布博客
async function createBlog(req,res){
  blog.create({
    'blogTitle':req.body.blogTitle,
    'blogContent':req.body.blogContent,
    'blogDate':req.body.blogDate,
    'blogType':req.body.blogType,
    'author' : req.body.userName
  },async function (err){
    if(err){
      return res.json(response(1,'','发布失败'))
    }
    res.json(response(0,'','发布成功'))
    if(req.body.userName ==='Calabash' || 'Maxeano' || 'maxeano'){
      await sendNotification({
        title:'新消息',
        body:`${req.body.userName}发布了新的文章 ${req.body.blogTitle}`,
        icon:'/calabash24.png'
      })
      return
    }

  })
}
//删除博客
async function deleteBlog(req,res){
  blog.remove({"blogDate":req.params.blogDate},async function (err,result) {
    if(err){
      return res.json(response(1,'','删除失败'))
    }
    await redisTool._delete(req.params.blogDate)
    return res.json(response(0,'','删除成功'))
  })
}
//修改博客
async function updateBlog(req,res){
  blog.update({"blogDate":req.params.blogDate},{$set:{
      "blogTitle" : req.body.blogTitle,
      "blogContent" : req.body.blogContent,
      "blogType" : req.body.blogType,
    }
  },function (err) {
    if(err){
      return res.json(response(1,'','修改失败'))
    }
    return res.json(response(0,'','修改成功'))
  })
}
//获取博客
async function getBlog(req,res){
  let blogDate = req.params.blogDate,
      userName = req.query.userName
  let list = await blog.find({"author":userName})
  let index = list.findIndex((item)=>item.blogDate===blogDate)
  if(index === -1){
    return res.json(response(1,'','文章不存在'))
  }
  //获取上一篇/下一篇的编号
  let {_id,blogType,...filterObj} = Object.assign(list[index].toObject(),{
    lastBlogDate:list[index-1]?list[index-1].blogDate:'0',
    nextBlogDate:list[index+1]?list[index+1].blogDate:'0'})
  //解决同一页面刷新重复计数的问题,但是如果两个文章间切换还是存在问题
  if(req.cookies.Cal === undefined || req.cookies.Cal !== blogDate){
    filterObj.count = await redisTool._incr(blogDate) || ''
    res.cookie('Cal',blogDate,{maxAge:1000*60*10,secure:true,path:'/api/ideas'})
  }else{
    filterObj.count = await redisTool._getValue(blogDate)
  }
  return res.json(response(0,filterObj,''))
}
//获取博客列表
async function getBlogList(req,res) {
  let {pgN,pgS,userName,type} = req.query
  let list = []
  if (type==='public' || type=== 'sticky'){
     list = await blog.find({"author":userName,"blogType":type},{"_id":0,"blogDate":1,"blogTitle":1}).sort({"blogDate":-1}).skip((pgN-1)*pgS).limit(parseInt(pgS))
  }
  if (type==='all'){
     list = await blog.find({"author":userName},{_id:0,blogContent:1,blogDate:1,blogTitle:1,blogType:1}).sort({"blogDate":-1}).skip((pgN-1)*pgS).limit(parseInt(pgS))
  }
  return res.json(response(0,list,''))
}
//发布评论
async function postComment(req,res){
  let {blogDate,userName,...commentBody} = req.body
  if (filter._filter(commentBody.text).flag){
    return res.json(response(1,"","含有敏感词"))
  }
  blog.update({"blogDate":blogDate},{$push:{comment:commentBody}},function (err) {
    if(err){
      return res.json(response(1,'','评论失败'))
    }else{
      return res.json(response(0,'','评论成功'))
    }
  })
}
//获取评论
async function getComment(req,res){
  blog.findOne({"blogDate":req.query.blogDate},{_id:0,comment:1},async function (e,doc) {
    if(e){
      return res.json(response(1,'','获取评论失败'))
    }
    let data = []
    for(let n of doc.comment){
      let avatar = await getUserProp(n.user,'avatar');
      data.push({
        avatar:avatar,
        user:n.user,
        text:n.text,
        date:n.date
      })
    }
    return res.json(response(0,data,''))
  })
}
//喜欢/取消喜欢文章
async function likeBlog(req,res){
  let {userName,user,blogDate,blogTitle} = req.body
  users.find({"userName":user,"likeList.blogDate":blogDate},async function (e,doc) {
    //说明喜欢过该文章
    if(doc.length>=1){
      Promise.all([
        users.findOneAndUpdate({"userName":user},{$pull:{"likeList":{"blogDate":blogDate}}},{"new":true}),
        blog.findOneAndUpdate({"author":userName,"blogDate":blogDate},{$inc:{"likeCount":-1}},{"new":true})
      ]).then((a)=>{
        let data = {
          likeList: a[0].likeList,
          count : a[1].likeCount
        }
        return res.json(response(0,data,'已经失去你的爱:('))
      })
    }else{
      Promise.all([
        users.findOneAndUpdate({"userName":user},{$push:{"likeList":{author:userName, blogDate:blogDate, blogTitle:blogTitle}}},{"new":true}),
        blog.findOneAndUpdate({"author":userName,"blogDate":blogDate},{$inc:{"likeCount":1}},{"new":true})
      ]).then((b)=>{
        let data = {
          likeList: b[0].likeList,
          count : b[1].likeCount
        }
        return res.json(response(0,data,'已收到你的爱:)'))
      })
    }
  })
}
//遍历推送
async function sendNotification(data){
  let list = await redisTool.getSubscription('subscription')
  let arr = []
  for(let n of list){
    arr.push(pushMessage(n,JSON.stringify(data)))
  }
  let result = await Promise.all(arr)
  for(let res of result){
    if(typeof res === 'string'){
      redisTool.removeSubscription(res)
    }
  }
}
//浏览器订阅
async function subscription(req,res){
  const value = req.body.data
  redisTool.saveSubscription('subscription',value)
  return res.json(response(0,'',''))
}


module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlog,
  getBlogList,
  postComment,
  getComment,
  likeBlog,
  subscription,
}
