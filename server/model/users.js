const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  "userName":String,
  "userPwd":String,
  "avatar":String,
  "userInfo":{
    "twitter":String,
    "github":String,
    "weibo":String
  },
  "likeList":[{
    "author":String,
    "blogDate":String,
    "blogTitle":String
  }],
  "collectList":[{
    "collectTitle":String,
    "collectType":String,
    "collectDesc":String,
    "list":[{
      "author":String,
      "blogDate":String
    }]
  }],
})

module.exports = mongoose.model('user',userSchema)
