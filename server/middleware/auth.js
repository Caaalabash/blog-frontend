module.exports = {
  // 允许跨域
  cors: (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Credentials','true')

    next()
  },
  // 记录ip, 从x-forwarded-for头信息中获取
  collectIP: app => {
    const { redisTool } = app.helper
    const whiteList = [
      '/pv',
      '/checkStatus',
      '/userinfo'
    ]
    return async (req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || ''

      if(!whiteList.includes(req.path) && ip.length) {
        redisTool.setIpLog(ip, req.url)
      }
      next()
    }
  },
  // 验证token
  validateToken: app => {
    const { redisTool, response } = app.helper
    const validToken = [
      'PUT/userinfo', //修改用户信息
      'POST/ideas',   //新增博文
      'DELETE/ideas', //删除博文
      'PUT/ideas',    //修改博文
      'POST/checkStatus' ,//检查token
      'POST/files', //上传图片
      'GET/pv',
      'POST/comment',
      'POST/like',
      'POST/avatar',
    ]
    return async (req, res, next) => {
      if(validToken.includes(req.method + req.path)) {
        let tok = req.headers['authorization'] || req.body.token || ''
        let userName = req.body.userName || req.headers['username'] || req.query.userName || ''
        // 垃圾代码
        if(userName !== 'Calabash' && req.path === '/pv') {
          return res.json(response(1, '', '没有权限'))
        }
        if(req.path=== '/comment' || req.path === '/like') {
          userName = req.body.user
        }

        const data = await redisTool.check(userName, tok)
        if (!data) return res.json(response(1, '', '凭证失效,请重新登录'))
        else next()
      } else {
        next()
      }
    }
  }
}
