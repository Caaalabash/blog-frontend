/**
 * 在实例化Express后拓展app, 在上面挂载:
 * 1. 挂载配置文件
 * 2. mongodb模型, 用于操作数据库
 * 3. 各个服务的实例, 例如redis/mongodb/alioss/multer
 * 4. 挂载工具类方法(工具类方法可能会依赖1,2,3)
 *
 * 这样做的原因就是类似于egg.js, 避免在controller/service中到处引用的不便
 */
module.exports = app => {
  app.app_config = require('../config/config')
  app.model = require('../model')
  app.blog_extend = require('../config')(app)
  app.helper = require('../lib')(app)

  return app
}