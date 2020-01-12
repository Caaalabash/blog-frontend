const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const schedule = require('node-schedule')
const extend = require('./extend')
const { log } = require('./middleware')

/**
 * 属性扩展
 * @description express()获得一个框架实例app,通过extend方法给实例上挂载需要的属性
 */
const app = extend(express())

app.set('views', './views')
app.set('view engine', 'pug')
app.set('trust proxy', 2)
app.use(log(app))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  name: 'calabash-token',
  secret: app.app_config.sessionSecret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    domain: 'calabash.top',
    secure: app.app_config.isProd,
    maxAge: 1000 * 3600
  },
}))

app.use('/robot', app.router.robotRouter)
app.use('/api/v1', app.router.userRouter)
app.use('/api/v2', app.router.chatRouter)
app.use('/api/v3', app.router.monitorRouter)
/**
 * 定时更新站点地图
 */
schedule.scheduleJob('0 0 18 * * *', app.helper.makeSiteMap)

module.exports = app
