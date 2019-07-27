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

      req.session.user = { _id: user._id, name: user.userName, isAdmin: user.isAdmin || false }
      req.session.isLogin = true
      return res.json(response(0, user, '登录成功'))
    },
    checkStatus(req, res) {
      return res.json(response(0, '', ''))
    },
    logout(req, res) {
      req.session.destroy(e => res.json(response(0, e, '注销成功')))
    },
    getMenu(req, res) {
      if (!req.session.isLogin) {
        res.json(response(0, [], ''))
        return
      }
      const menu = [
        { path: '/admin/new', icon: 'el-icon-edit-outline', label: '发布文章' },
        { path: '/admin/articles', icon: 'el-icon-search', label: '管理文章' },
        { path: '/admin/setting', icon: 'el-icon-setting', label: '个人设置' },
        req.session.user.isAdmin && { path: '/admin/maxeano', icon: 'el-icon-star-off', label: '猪猪专属'},
        { path: '/admin/chat', icon: 'el-icon-message', label: '站内信'},
        req.session.user.isAdmin && { path: '/admin/pv', icon: 'el-icon-bell', label: '日志' },
        { path: '/', icon: 'el-icon-back', label: '返回首页' },
        { icon: 'el-icon-close', label: '注销' }
      ]
      res.json(response(0, menu.filter(Boolean), ''))
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
