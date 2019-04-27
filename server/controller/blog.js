module.exports = app => {
  const { userModel, articleModel } = app.model
  const { response, redisTool, filterSensitiveWord, getUserProp } = app.helper
  const TEN_MINUTES = 10 * 60 * 1000
  const NO_MORE = '0'

  return {
    // 发布博客
    async createBlog(req, res) {
      const { blogTitle, blogContent, blogDate, blogType, userName: author } = req.body
      const doc = await articleModel.create({
        author,
        blogTitle,
        blogContent,
        blogDate,
        blogType
      })
      if (!doc) return res.json(response(1, '', '发布失败'))

      return res.json(response(0, '', '发布成功'))
    },
    // 删除博客
    async deleteBlog(req, res) {
      const { blogDate } = req.params
      await Promise.all([
        articleModel.findOneAndRemove({ blogDate }),
        redisTool.deleteValue(blogDate)
      ])

      return res.json(response(0, '', '删除成功'))
    },
    // 修改博客
    async updateBlog(req, res) {
      const { blogDate } = req.params
      const { blogTitle, blogContent, blogType } = req.body
      await articleModel.findOneAndUpdate({ blogDate }, {
        $set: {
          blogTitle,
          blogContent,
          blogType,
        }
      })

      return res.json(response(0, '', '修改成功'))
    },
    // 获取博客
    async getBlog(req, res) {
      const { blogDate } = req.params
      const { userName: author } = req.query
      const readSign = req.cookies.Cal

      const isBlogExist = await articleModel.findOne({ author, blogDate })
      if (!isBlogExist) return res.json(response(1, '', '文章不存在'))

      const blog = isBlogExist.toObject()
      // blogDate > curBlogDate -> 发布时间越近 -> 称为当前的上一篇
      // blogDate < curBlogDate -> 发布时间越远 -> 称为当前的下一篇
      const [last, nextArray] = await Promise.all([
        articleModel.findOne({ author, 'blogDate': { $gt: blogDate } }),
        articleModel.find({ author, 'blogDate': { $lt: blogDate } }).sort({ 'blogDate': -1 }).limit(1)
      ])
      blog.nextBlogDate = (nextArray && nextArray.length) ? nextArray[0].blogDate : NO_MORE
      blog.lastBlogDate = last ? last.blogDate : NO_MORE

      if (!readSign || readSign !== blogDate) {
        blog.count = await redisTool.increment(blogDate) || ''
        res.cookie('Cal', blogDate, { maxAge: TEN_MINUTES })
      } else {
        blog.count = await redisTool.getValue(blogDate)
      }

      return res.json(response(0, blog, ''))
    },
    // 获取博客列表
    async getBlogList(req, res) {
      const { pgN, pgS, userName: author, type: blogType } = req.query
      const isAll = blogType === 'all'
      const query = isAll ? { author } : { author, blogType }
      const filter = isAll ? { '_id': 0 } : { '_id': 0, 'blogDate': 1, 'blogTitle': 1 }

      const list = await articleModel.find(query, filter)
        .sort({ 'blogDate': -1 })
        .skip((pgN - 1) * pgS)
        .limit(parseInt(pgS))

      return res.json(response(0, list, ''))
    },
    // 发布评论
    async postComment(req, res) {
      const { blogDate, userName: author, ...commentBody } = req.body
      if (filterSensitiveWord(commentBody.text).flag) return res.json(response(1, '', '含有敏感词'))

      await articleModel.updateOne({ author, blogDate }, {
        $push: { comment: commentBody }
      })

      return res.json(response(0, '', '评论成功'))
    },
    // 获取评论
    async getComment(req, res) {
      const { blogDate } = req.query
      const doc = await articleModel.findOne({ blogDate }, { _id: 0, comment: 1 })
      if(!doc) return res.json(response(1,'','获取评论失败'))

      const commentList = doc.comment.toObject()
      const commentUserList = [...new Set(commentList.map(comment => comment.user))]
      const commentUserAvatar = await Promise.all(commentUserList.map(name => getUserProp(name, 'avatar')))
      const map = commentUserAvatar.reduce((map, avatar, index) => {
        map[commentUserList[index]] = avatar
        return map
      }, {})

      commentList.forEach((comment, index) => commentList[index].avatar = map[comment.user])

      return res.json(response(0, commentList, ''))
    },
    // 喜欢/取消喜欢文章
    async likeBlog(req, res) {
      const { userName, user, blogDate, blogTitle } = req.body
      const liked = await userModel.findOne({ 'userName': user, 'likeList.blogDate': blogDate })
      const responseLabel = liked ? '已经失去你的爱:(' : '已收到你的爱:)'
      let data

      if (liked) {
        const cancelLike = await Promise.all([
          userModel.findOneAndUpdate({ 'userName': user }, { $pull: { 'likeList': { blogDate }}}, { 'new': true }),
          articleModel.findOneAndUpdate({ 'author': userName, blogDate }, { $inc: { 'likeCount': -1 }}, { 'new': true })
        ])
        data = {
          likeList: cancelLike[0].likeList,
          count : cancelLike[1].likeCount
        }
      } else {
        const like = await Promise.all([
          userModel.findOneAndUpdate({ 'userName': user }, { $push: { 'likeList': { author: userName, blogDate, blogTitle }}}, { 'new': true }),
          articleModel.findOneAndUpdate({ 'author': userName, blogDate }, { $inc: { 'likeCount': 1 }}, { 'new': true })
        ])
        data = {
          likeList: like[0].likeList,
          count : like[1].likeCount
        }
      }
      return res.json(response(0, data, responseLabel))
    }
  }
}
