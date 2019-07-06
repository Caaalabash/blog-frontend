const Redis = require('ioredis')

module.exports = app => {
  const { redis } = app.app_config

  const blog_redis = new Redis({
    port: redis.port,
    host: redis.host,
    password: redis.password
  })
  blog_redis.on('connect', function () {
    console.log('redis连接成功')
  })

  blog_redis.on('error', function () {
    console.log('redis连接失败')
  })

  return blog_redis
}
