module.exports = {
  /**
   * 访问记录监控中间件
   */
  collectIP: app => {
    const { redisTool } = app.helper

    return async (req, res, next) => {
      const ip = req.headers['x-real-ip'] || ''

      if(ip) redisTool.setIpLog(ip, req.url)
      next()
    }
  },
  /**
   * 鉴权中间件
   */
  validate: app => {
    const { response } = app.helper

    return (req, res, next) => {
      if (!req.cookies['calabash-token']) res.json(response(1, '', ''))
      else if (!req.session.isLogin) res.json(response(1, '', '凭证失效,请重新登录'))
      else next()
    }
  }
}
