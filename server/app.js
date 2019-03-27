const express = require('express')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const extend = require('./extend')
const { log } = require('./middleware')
const userRouter = require('./routes/users')
const chatRouter = require('./routes/chats')
const monitorRouter = require('./routes/api-monitor')

const app = express()
extend(app)

app.use(log(app))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api/v1', userRouter(app))
app.use('/api/v2', chatRouter(app))
app.use('/api/v3', monitorRouter(app))

module.exports = app
