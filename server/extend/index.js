/**
 * 在实例化Express后拓展app, 在上面挂载如下属性:
 * 1. 挂载应用配置文件
 * 2. 挂载mongodb模型, 用于操作数据库
 * 3. 挂载各个服务的实例, 例如redis/mongodb/alioss/multer
 * 4. 挂载工具类方法(工具类方法可能会依赖1,2,3)
 *
 * 这样做的原因就是类似于egg.js, 避免在controller/service中到处require的不便
 */
const config = Symbol('config')
const model = Symbol('model')
const extend = Symbol('extend')
const helper = Symbol('helper')

module.exports = app => ({
  ...app,
  get app_config() {
    if(!this[config]) this[config] = require('../config/config')

    return this[config]
  },
  get model() {
    if(!this[model]) this[model] = require('../model')

    return this[model]
  },
  get blog_extend() {
    if(!this[extend]) this[extend] = require('../config')(this)

    return this[extend]
  },
  get helper() {
    if(!this[helper]) this[helper] = require('../lib')(this)

    return this[helper]
  }
})