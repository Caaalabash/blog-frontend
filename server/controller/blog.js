module.exports = app => {
  const { userModel, blogModel } = app.model
  const { response, redisTool, filterSensitiveWord, getUserProp } = app.helper

  return {
    // 发布博客
    async createBlog(req, res){
      blogModel.create({
        'blogTitle':req.body.blogTitle,
        'blogContent':req.body.blogContent,
        'blogDate':req.body.blogDate,
        'blogType':req.body.blogType,
        'author' : req.body.userName
      }, function (err) {
        if(err) return res.json(response(1, '', '发布失败'))
        res.json(response(0, '', '发布成功'))
      })
    },
    // 删除博客
    async deleteBlog(req, res){
      blogModel.remove({ 'blogDate': req.params.blogDate }, async function (err) {
        if(err) return res.json(response(1, '', '删除失败'))
        await redisTool.deleteValue(req.params.blogDate)
        return res.json(response(0, '', '删除成功'))
      })
    },
    // 修改博客
    async updateBlog(req, res){
      blogModel.updateOne({ 'blogDate': req.params.blogDate },{ $set: {
          'blogTitle': req.body.blogTitle,
          'blogContent': req.body.blogContent,
          'blogType': req.body.blogType,
        }
      }, function (err) {
        if(err) return res.json(response(1,'','修改失败'))
        return res.json(response(0,'','修改成功'))
      })
    },
    // 获取博客
    async getBlog(req, res) {
      let blogDate = req.params.blogDate,
        userName = req.query.userName
      let list = await blogModel.find({ 'author': userName })

      let index = list.findIndex(item => item.blogDate === blogDate)
      if(index === -1) return res.json(response(1,'','文章不存在'))

      // 获取上一篇/下一篇的编号
      let { _id, blogType, ...filterObj } = Object.assign(list[index].toObject(), {
        lastBlogDate: list[index-1] ? list[index-1].blogDate : '0',
        nextBlogDate: list[index+1] ? list[index+1].blogDate : '0'
      })
      // 避免重复计数
      if(req.cookies.Cal === undefined || req.cookies.Cal !== blogDate){
        filterObj.count = await redisTool.increment(blogDate) || ''
        res.cookie('Cal',blogDate, { maxAge: 1000*60*10 })
      } else {
        filterObj.count = await redisTool.getValue(blogDate)
      }
      return res.json(response(0, filterObj, ''))
    },
    // 获取博客列表
    async getBlogList(req, res) {
      let { pgN, pgS, userName, type } = req.query
      let list = []
      if (type === 'public' || type === 'sticky') {
        list = await blogModel.find({ 'author': userName, 'blogType': type }, {'_id': 0, 'blogDate': 1, 'blogTitle': 1 })
          .sort({ 'blogDate': -1 })
          .skip((pgN - 1) * pgS)
          .limit(parseInt(pgS))
      }
      if (type === 'all') {
        list = await blogModel.find({ 'author': userName }, { _id: 0, blogContent: 1, blogDate: 1, blogTitle: 1, blogType: 1 })
          .sort({'blogDate': -1})
          .skip((pgN - 1) * pgS)
          .limit(parseInt(pgS))
      }
      return res.json(response(0,list,''))
    },
    // 发布评论
    async postComment(req, res) {
      let { blogDate, userName, ...commentBody } = req.body
      if (filterSensitiveWord(commentBody.text).flag) return res.json(response(1, '', '含有敏感词'))

      blogModel.updateOne({ 'blogDate': blogDate }, { $push: { comment: commentBody }}, function (err) {
        if(err) return res.json(response(1, '', '评论失败'))
        return res.json(response(0, '', '评论成功'))
      })
    },
    // 获取评论
    async getComment(req, res) {
      blogModel.findOne({ 'blogDate': req.query.blogDate }, { _id: 0, comment: 1 }, async function (e,doc) {
        if(e) return res.json(response(1,'','获取评论失败'))

        let data = []
        for(let n of doc.comment){
          let avatar = await getUserProp(n.user, 'avatar')
          data.push({
            avatar: avatar,
            user: n.user,
            text: n.text,
            date: n.date
          })
        }
        return res.json(response(0, data, ''))
      })
    },
    // 喜欢/取消喜欢文章
    async likeBlog(req,res){
      let { userName, user, blogDate, blogTitle } = req.body
      userModel.find({ 'userName': user, 'likeList.blogDate': blogDate }, async function (e, doc) {
        // 喜欢过该文章
        if(doc.length >= 1){
          const cancelLike = await Promise.all([
            userModel.findOneAndUpdate({ 'userName': user },
              { $pull: { 'likeList': { 'blogDate': blogDate }}},
              { 'new': true }),
            blogModel.findOneAndUpdate({ 'author': userName, 'blogDate': blogDate },
              { $inc: { 'likeCount': -1 }},
              { 'new': true })
          ])
          const data = {
            likeList: cancelLike[0].likeList,
            count : cancelLike[1].likeCount
          }
          return res.json(response(0, data, '已经失去你的爱:('))
        }else{
          const like = await Promise.all([
            userModel.findOneAndUpdate({ 'userName': user },
              { $push: { 'likeList': { author: userName, blogDate: blogDate, blogTitle: blogTitle }}},
              { 'new': true }),
            blogModel.findOneAndUpdate({ 'author': userName, 'blogDate': blogDate },
              { $inc: { 'likeCount': 1 }},
              { 'new': true })
          ])
          const data = {
            likeList: like[0].likeList,
            count : like[1].likeCount
          }
          return res.json(response(0, data, '已收到你的爱:)'))
        }
      })
    }
  }
}
