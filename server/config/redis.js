const Redis = require('ioredis')
const { redis, jwt } = require('./config')

module.exports = app => {
  if (!app.blog_extend) {
    const blog_redis = new Redis({
      port: redis.port,
      host: redis.host,
      password: redis.password
    })
    blog_redis.on('connect', function () {
      console.log('redis连接成功')
    })

    blog_redis.on('error', function (error) {
      console.log(error)
    })
    blog_redis.jwt_secret = jwt.secret

    return blog_redis
  }
  return app.blog_extend.redis
}
