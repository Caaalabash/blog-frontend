const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const extend = require('./extend')
const { log } = require('./middleware')
const userRouter = require('./routes/users')
const chatRouter = require('./routes/chats')
const monitorRouter = require('./routes/api-monitor')

/**
 * 属性扩展
 * @description express()获得一个框架实例app,通过extend方法给实例上挂载需要的属性
 */
const app = extend(express())

app.use(log(app))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api/v1', userRouter(app))
app.use('/api/v2', chatRouter(app))
app.use('/api/v3', monitorRouter(app))

module.exports = app
