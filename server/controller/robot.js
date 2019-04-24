const marked = require('marked')

module.exports = app => {
  const { rsp } = app.helper
  const { blogModel } = app.model

  return {
    // 文章SSR
    async renderArticle(req, res) {
      const { userName: author, blogDate } = req.params
      const blogInfo = await blogModel.findOne({ author, blogDate })
      if (!blogInfo) return res.status(404).send('Sorry, we cannot find that!')
      const content = marked(blogInfo.blogContent)

      return res.render('article', { title: blogInfo.blogTitle, content, author })
    },

    // 首页SSR
    async renderIndex(req, res) {
      const author = req.params.userName || 'Calabash'
      const filter = { '_id': 0, 'blogDate': 1, 'blogTitle': 1 }
      const blogList = await blogModel.find({ author, blogType: 'public' }, filter).sort({ 'blogDate': -1 })
      if (!blogList) return res.status(404).send('Sorry, we cannot find that!')

      return res.render('index', { articleList: blogList, author })
    }
  }
}
