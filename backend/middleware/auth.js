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
  validate: app => {
    const { response } = app.helper

    return (req, res, next) => {
      if (req.session.isLogin) {
        next()
      } else {
        return res.json(response(1, '', '凭证失效,请重新登录'))
      }
    }
  }
}
