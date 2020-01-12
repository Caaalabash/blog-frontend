const path = require('path')
const requireContext = require('require-context')
const configObject = require('../config')

const config = Symbol('app_config')
const model = Symbol('model')
const plugin = Symbol('plugin')
const helper = Symbol('helper')
const controller = Symbol('controller')
const router = Symbol('router')
const modelContext = requireContext(path.join(__dirname, '../model'), false, /\.js$/)
const pluginContext = requireContext(path.join(__dirname, '../plugin'), false, /\.js$/)
const controllerContext = requireContext(path.join(__dirname, '../controller'), false, /\.js$/)
const helperContext = requireContext(path.join(__dirname, '../helper'), false, /\.js$/)
const routerContext = requireContext(path.join(__dirname, '../routes'), false, /\.js$/)

const modelObject = modelContext.keys().reduce((obj, filename) => {
  const model =  modelContext(filename)
  const key = model.modelName + 'Model'
  obj[key] = model

  return obj
}, {})

const getPluginObject = app => {
  return pluginContext.keys().reduce((obj, filename) => {
    const model = pluginContext(filename)
    const key = filename.split('.')[0]
    obj[key] = model(app)

    return obj
  }, {})
}

const getHelperObject = app => {
  return helperContext.keys().reduce((obj, filename) => {
    const model = helperContext(filename)
    const util = typeof model === 'function' ? model(app) : model
    obj = { ...obj, ...util }

    return obj
  }, {})
}

const getControllerObject = app => {
  return controllerContext.keys().reduce((obj, filename) => {
    const key = filename.split('.')[0] + 'Controller'
    const model = controllerContext(filename)
    obj[key] = model(app)

    return obj
  }, {})
}

const getRouterObject = app => {
  return routerContext.keys().reduce((obj, filename) => {
    const key = filename.split('.')[0] + 'Router'
    const model = routerContext(filename)
    obj[key] = model(app)

    return obj
  }, {})
}

/**
 * 在实例化 Express 后拓展 app
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
    },
    // 应用router
    'router': {
      get() {
        if (!this[router]) this[router] = getRouterObject(this)
        return this[router]
      }
    }
  })
  return app
}