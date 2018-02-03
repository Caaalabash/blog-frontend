const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "userInfo":{
    "twitter":String,
    "github":String,
    "weibo":String
  },
  "blogList":[{
    "blogId":String,
    "blogTitle":String,
    "blogDate":String,
    "blogContent":String,
    "blogType":String
  }]
})

module.exports = mongoose.model('user',userSchema)
