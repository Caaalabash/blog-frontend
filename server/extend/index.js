const __blogConfig = require('../config')
const __modelConfig = require('../model')
const __util = require('../lib')

module.exports = app => {
  app.model = __modelConfig
  app.blog_extend = __blogConfig(app)
  app.helper = __util(app)

  return app
}