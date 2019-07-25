const requireContext = require('require-context')

const config = Symbol('app_config')
const model = Symbol('model')
const plugin = Symbol('plugin')
const helper = Symbol('helper')
const controller = Symbol('controller')
/**
 * @description 参考webpack require.context语法
 * @todo 目录层级都需要多添加 ../, 为该库的bug
 */
const modelContext = requireContext('../../model', false, /\.js$/)
const pluginContext = requireContext('../../plugin', false, /\.js$/)
const controllerContext = requireContext('../../controller', false, /\.js$/)
const helperContext = requireContext('../../helper', false, /\.js$/)
/**
 * @description 应用配置
 */
const configObject = require('../config')
/**
 * @description 组装对象 { userModel, articleModel, logModel, chatModel }
 */
const modelObject = modelContext.keys().reduce((obj, filename) => {
  const model =  modelContext(filename)
  const key = model.modelName + 'Model'
  obj[key] = model

  return obj
}, {})
/**
 * @description 获得插件对象
 * @param {object} app 应用实例
 * @return { alioss, mongodb, multer, redis }
 */
const getPluginObject = app => {
  return pluginContext.keys().reduce((obj, filename) => {
    const model = pluginContext(filename)
    const key = filename.split('.')[0]
    obj[key] = model(app)

    return obj
  }, {})
}
/**
 * @description 获得所有工具函数
 * @param {object} app 应用实例
 * @return { response, redisTool }
 */
const getHelperObject = app => {
  return helperContext.keys().reduce((obj, filename) => {
    const model = helperContext(filename)
    const util = typeof model === 'function' ? model(app) : model
    obj = { ...obj, ...util }

    return obj
  }, {})
}
/**
 * @description 获得所有controller
 * @param {object} app 应用实例
 * @return { apiController, blogController, chatController, robotController, userController }
 */
const getControllerObject = app => {
  return controllerContext.keys().reduce((obj, filename) => {
    const key = filename.split('.')[0] + 'Controller'
    const model = controllerContext(filename)
    obj[key] = model(app)

    return obj
  }, {})
}
/**
 * @description 在实例化 Express 后拓展 app
 */
module.exports = app => {
  Object.defineProperties(app, {
    // 数据库模型
    'model': {
      get() {
        if (!this[model]) this[model] = modelObject
        return this[model]
      }
    },
    // 应用配置
    'app_config': {
      get() {
        if (!this[config]) this[config] = configObject
        return this[config]
      }
    },
    // 应用插件: 依赖应用配置
    'plugin': {
      get() {
        if (!this[plugin]) this[plugin] = getPluginObject(this)
        return this[plugin]
      }
    },
    // 应用工具函数: 依赖应用配置, 依赖应用插件
    'helper': {
      get() {
        if (!this[helper]) this[helper] = getHelperObject(this)
        return this[helper]
      }
    },
    // 应用controller: 依赖工具函数, 依赖应用配置, 依赖应用插件
    'controller': {
      get() {
        if (!this[controller]) this[controller] = getControllerObject(this)
        return this[controller]
      }
    }
  })
  return app
}