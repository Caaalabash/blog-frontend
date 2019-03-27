module.exports = app => ({
  redisTool: require('./redisTool')(app),
  ...require('./tool')(app),
  ...require('./filter')
})