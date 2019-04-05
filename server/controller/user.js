module.exports = app => {
  const { response, redisTool } = app.helper
  const { userModel } = app.model
  const { alioss } = app.blog_extend
  const { upload } = app.app_config

  return {
    // 注册
    async register(req ,res) {
      let { userName } = req.body
      let user = await userModel.findOne({ 'userName': userName })
      if(user) return res.json(response(1, '', '该昵称已被占用'))

      let createUser = await userModel.create(req.body)
      return createUser
        ? res.json(response(0, '', '注册成功'))
        : res.json(response(1, '', '注册失败'))
    },
    // 登录
    async login(req, res) {
      let userName = req.body.userName
      let user = await userModel.findOne(req.body, { 'userPwd': 0, '__v': 0, 'blogList': 0 })
      if(user){
        let tokenVal = await redisTool.sign(userName)
        user.blogList = []
        return res.json(response(0, user, '登录成功', tokenVal))
      }else{
        return res.json(response(1, '', '用户名或密码错误'))
      }
    },
    // 注销
    async logout(req,res) {
      let { userName } = req.body
      const result = await redisTool.deleteValue(userName)

      if(result === 1 || result === 0) return res.json(response(0, '', '注销成功'))
      return res.json(response(1, '', '凭证已过期'))
    },
    // 检查token
    checkStatus(req, res) {
      return res.json(response(0, '', ''))
    },
    // 修改个人信息
    updateUserInfo(req, res) {
      const { userName, ...userInfo } = req.body
      userModel.updateOne({ 'userName': userName }, { $set: { userInfo: userInfo }}, function (e) {
        if(e) return res.json(response(1, '', '修改失败'))
        return res.json(response(0, '', '修改成功'))
      })
    },
    // 获取个人信息
    getUserInfo(req, res) {
      userModel.find({ 'userName': req.query.userName }, { '_id': 0, 'userInfo': 1 }, function (e,doc) {
        if(e || !doc[0]) return res.json(response(1, '', ''))
        return res.json(response(0, doc[0].userInfo, ''))
      })
    },
    // 图片上传
    async uploadPic(req, res) {
      const uploadOss = await alioss.put(`/img/${req.file.filename}`, `${upload.img}/${req.file.filename}`)
      if (uploadOss.res.status === 200) {
        const path = `https://static.calabash.top/img/${req.file.filename}`
        return res.json(response(0, path, ''))
      }
      return res.json(response(1, '', '上传失败'))
    },
    //头像上传
    async uploadAvatar(req, res) {
      let path = `https://blog.calabash.top/${req.file.filename}`
      let userName = req.headers['username']
      await userModel.updateOne({ 'userName': userName }, { $set: { avatar: path }})
      return res.json(response(0, path, '设置成功'))
    },
    //获取ip地址
    async getIP(req, res) {
      let date = req.query.date
      let result = await redisTool.getIpLog(date)
      return res.json(response(0,result,''))
    },
    // 创建收藏夹
    async createCollect(req, res) {
      let { userName, ...obj } = req.body
      userModel.find({ 'userName': userName, 'collectList.collectTitle': obj.title },async function (e,doc) {
        if(doc.length >= 1) return res.json(response(1,'','该收藏夹已存在'))

        await userModel.updateOne({ 'userName': userName }, { $push: { 'collectList': {
          'collectTitle': obj.title,
          'collectType': obj.type,
          'collectDesc': obj.desc,
          'list': []
        }}})
        return res.json(response(0, '', '创建成功'))
      })
    },
    // 删除收藏夹
    async deleteCollect(req, res) {
      let { collectTitle, userName } = req.body
      userModel.updateOne({ 'userName': userName },
        { $pull: { 'collectList': { 'collectTitle': collectTitle }}}, function (e) {
        if(e) return res.json(response(1, '', '删除失败'))
        return res.json(response(0, '', '删除成功'))
      })
    },
    // 收藏
    async collect(req, res) {
      let { userName, author, blogDate, collect } = req.body
      let user = await userModel.findOne({ 'userName': userName })

      if (!user) return res.json(response(1, '', '没有该用户'))

      let index = user.collectList.findIndex(item => item.collectTitle === collect)
      if(user.collectList[index].list.some(item => item.blogDate === blogDate)) {
        return res.json(response(1, '', '已收藏该文章'))
      }
      user.collectList[index].list.push({ author, blogDate })
      await user.save()
      return res.json(response(0,'','收藏成功'))
    },
    //删除收藏夹中某个文章
    async deleteCollectBlog(req, res) {
      let { userName } = req.body

      let user = await userModel.findOne({ 'userName': userName })
      if (!user) return res.json(response(1, '', '没有该用户'))

      let index = user.collectList.findIndex(item => item.collectTitle === req.body.collectTitle)
      if (index === -1) return res.json(response(1, '', '收藏夹不存在'))

      let i = user.collectList[index].list.findIndex(item=>item.blogDate===req.body.blogDate && item.author===req.body.author)
      if(i === -1) return res.json(response(1, '', '收藏夹中不存在该文章'))

      user.collectList[index].list.splice(i,1)
      await user.save()
      return res.json(response(0, '', '删除成功'))
    }
  }
}
