module.exports = app => {
  const { response } = app.helper
  const { userModel } = app.model
  const { alioss } = app.plugin
  const { upload, ossPath } = app.app_config

  return {
    async register(req, res) {
      const user = await userModel.findOne({ userName: req.body.userName })
      if (user) return res.json(response(1, '', '该昵称已被占用'))

      const createUser = await userModel.create(req.body)
      if (!createUser) return res.json(response(1, '', '注册失败'))

      return res.json(response(0, '', '注册成功'))
    },
    async login(req, res) {
      const user = await userModel.findOne(req.body, { 'userPwd': 0, 'blogList': 0 })
      if (!user) return res.json(response(1, '', '用户名或密码错误'))

      req.session.user = { _id: user._id, name: user.userName }
      req.session.isLogin = true
      return res.json(response(0, user, '登录成功'))
    },
    checkStatus(req, res) {
      return res.json(response(0, '', ''))
    },
    logout(req, res) {
      req.session.destroy(e => res.json(response(0, e, '注销成功')))
    },
    async updateUserInfo(req, res) {
      const { userName, ...userInfo } = req.body
      const resp = await userModel.updateOne({ userName }, { $set: { userInfo }})
      if (!resp) return res.json(response(1, '', '修改失败'))

      return res.json(response(0, '', '修改成功'))
    },
    async getUserInfo(req, res) {
      const resp = await userModel.findOne({ userName: req.query.userName }, { '_id': 0, 'userInfo': 1 })
      if (!resp) return res.json(response(1, '', ''))

      return res.json(response(0, resp.userInfo, ''))
    },
    async uploadPic(req, res) {
      const path = `${ossPath.host}/${ossPath.filePath}/${req.file.filename}`
      const uploadOss = await alioss.put(`${ossPath.filePath}/${req.file.filename}`, `${upload.img}/${req.file.filename}`)
      if (uploadOss.res.status !== 200) return res.json(response(1, '', '上传失败'))

      return res.json(response(0, path, ''))
    },
    async uploadAvatar(req, res) {
      const path = `${ossPath.host}/${ossPath.avatarPath}/${req.file.filename}`
      const uploadOss = await alioss.put(`${ossPath.avatarPath}/${req.file.filename}`, `${upload.img}/${req.file.filename}`)
      if (uploadOss.res.status !== 200) return res.json(response(1, '', '上传失败'))

      await userModel.updateOne({ userName: req.session.user.name }, { $set: { avatar: path }})

      return res.json(response(0, path, '设置成功'))
    },
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
  }
}
