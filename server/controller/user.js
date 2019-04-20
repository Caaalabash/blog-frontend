module.exports = app => {
  const { response, redisTool } = app.helper
  const { userModel } = app.model
  const { alioss } = app.blog_extend
  const { upload } = app.app_config

  return {
    // 注册
    async register(req, res) {
      const user = await userModel.findOne({ userName: req.body.userName })
      if (user) return res.json(response(1, '', '该昵称已被占用'))

      const createUser = await userModel.create(req.body)
      if (!createUser) return res.json(response(1, '', '注册失败'))

      return res.json(response(0, '', '注册成功'))
    },
    // 登录
    async login(req, res) {
      const user = await userModel.findOne(req.body, { 'userPwd': 0, 'blogList': 0 })
      if (!user) return res.json(response(1, '', '用户名或密码错误'))
      const tokenVal = await redisTool.sign(req.body.userName)

      return res.json(response(0, user, '登录成功', tokenVal))
    },
    // 注销
    async logout(req, res) {
      const result = await redisTool.deleteValue(req.body.userName)
      if (result === 1 || result === 0) return res.json(response(0, '', '注销成功'))

      return res.json(response(1, '', '凭证已过期'))
    },
    // 修改个人信息
    async updateUserInfo(req, res) {
      const { userName, ...userInfo } = req.body
      const resp = await userModel.updateOne({ userName }, { $set: { userInfo }})
      if (!resp) return res.json(response(1, '', '修改失败'))

      return res.json(response(0, '', '修改成功'))
    },
    // 获取个人信息
    async getUserInfo(req, res) {
      const resp = await userModel.findOne({ userName: req.query.userName }, { '_id': 0, 'userInfo': 1 })
      if (!resp) return res.json(response(1, '', ''))

      return res.json(response(0, resp.userInfo, ''))
    },
    // 图片上传
    async uploadPic(req, res) {
      const path = `https://static.calabash.top/img/${req.file.filename}`
      const uploadOss = await alioss.put(`/img/${req.file.filename}`, `${upload.img}/${req.file.filename}`)
      if (uploadOss.res.status === 200) return res.json(response(0, path, ''))

      return res.json(response(1, '', '上传失败'))
    },
    // 头像上传
    async uploadAvatar(req, res) {
      const path = `https://blog.calabash.top/${req.file.filename}`
      const userName = req.headers['username']
      await userModel.updateOne({ userName }, { $set: { avatar: path }})

      return res.json(response(0, path, '设置成功'))
    },
    //获取ip地址
    async getIP(req, res) {
      const date = req.query.date
      const result = await redisTool.getIpLog(date)

      return res.json(response(0, result, ''))
    },
    // 创建收藏夹
    async createCollect(req, res) {
      const { userName, ...rest } = req.body
      const isExist = await userModel.findOne({ userName, 'collectList.collectTitle': rest.title })
      if (isExist) return res.json(response(1, '', '该收藏夹已存在'))

      await userModel.updateOne({ userName }, {
        $push: {
          'collectList': {
            'collectTitle': rest.title,
            'collectType': rest.type,
            'collectDesc': rest.desc,
            'list': []
          }
        }
      })
      return res.json(response(0, '', '创建成功'))
    },
    // 删除收藏夹
    async deleteCollect(req, res) {
      const { collectTitle, userName } = req.body
      const resp = await userModel.updateOne({ userName }, {
        $pull: {
          'collectList': {
            'collectTitle': collectTitle
          }
        }
      })
      if (!resp) return res.json(response(1, '', '删除失败'))
      return res.json(response(0, '', '删除成功'))
    },
    // 收藏
    async collect(req, res) {
      const { userName, author, blogDate, collect } = req.body
      await userModel.findOneAndUpdate({
        userName,
        'collectList.collectTitle': collect
      }, {
        $push: {
          'collectList.$.list': {
            author, blogDate
          }
        }
      })

      return res.json(response(0,'','收藏成功'))
    },
    // 删除收藏夹中某个文章
    async deleteCollectBlog(req, res) {
      const { userName, collectTitle, blogDate } = req.body
      await userModel.findOneAndUpdate({
        userName,
        'collectList.collectTitle': collectTitle
      }, {
        $pull: {
          'collectList.$.list': {
            blogDate
          }
        }
      })

      return res.json(response(0, '', '删除成功'))
    },
    // 检查token
    checkStatus(req, res) {
      return res.json(response(0, '', ''))
    },
  }
}
