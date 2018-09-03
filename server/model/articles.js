const mongoose = require('mongoose')

let articleSchema = new mongoose.Schema({
  "blogTitle":String,
  "blogDate":String,
  "blogContent":String,
  "blogType":String,
  "likeCount":{
    type:Number,
    default:0
  },
  "comment":[{
    "user":String,
    "date":String,
    "text":String
  }],
  "author":String
})

module.exports = mongoose.model('article',articleSchema)
