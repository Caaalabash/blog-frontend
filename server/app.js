const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')

const extend = require('./extend')
const { log } = require('./middleware')
const userRouter = require('./routes/users')
const chatRouter = require('./routes/chats')
const robotRouter = require('./routes/robots')
const monitorRouter = require('./routes/api-monitor')

/**
 * 属性扩展
 * @description express()获得一个框架实例app,通过extend方法给实例上挂载需要的属性
 */
const app = extend(express())

app.set('views', './views')
app.set('view engine', 'pug')

app.use(log(app))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/robot', robotRouter(app))
app.use('/api/v1', userRouter(app))
app.use('/api/v2', chatRouter(app))
app.use('/api/v3', monitorRouter(app))
/**
 * 定时更新站点地图
 */
schedule.scheduleJob('0 0 18 * * *', app.helper.makeSiteMap)

module.exports = app
