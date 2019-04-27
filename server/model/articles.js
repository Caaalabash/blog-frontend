/**
 * 文章表结构
 * blogTitle: 文章标题
 * blogDate: 发布日期(也作为索引使用)
 * blogContent: 文章内容
 * blogType: 文章类型: public/private/sticky
 * lickCount: 喜欢数量
 * comment: 评论数组, 包括: 评论用户名, 日期, 内容
 * author: 文章作者
 */
const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  blogTitle: String,
  blogDate: String,
  blogContent: String,
  blogType: String,
  likeCount: {
    type: Number,
    default: 0
  },
  comment:[{
    user: String,
    date: String,
    text: String
  }],
  author: String
})

module.exports = mongoose.model('article', articleSchema)
