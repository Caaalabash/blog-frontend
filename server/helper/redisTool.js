const jwt = require('jsonwebtoken')

module.exports = app => {
  const { redis } = app.plugin
  const { secret } = app.app_config.jwt

  return {
    redisTool: {
      // 生成用户token
      sign(user) {
        const token = jwt.sign({ user }, secret)
        redis.set(user, token)
        redis.expire(user, 3600)

        return token
      },
      // 刷新用户token
      update(user) {
        redis.expire(user, 3600)
      },
      // 获得某个值
      getValue(key) {
        return redis.get(key)
      },
      // 删除某个值
      deleteValue(key) {
        return redis.del(key)
      },
      // 检查某个值是否存在
      async check(key, value) {
        const storeValue = await redis.get(key)

        if (storeValue !== value) return false
        redis.expire(key, 3600)
        return true
      },
      // 增加访问量
      increment(blog) {
        redis.incr(blog)
        return redis.get(blog)
      },
      // 记录ip
      async setIpLog(ip, path) {
        const [key, time] = new Date().toLocaleString('zh', { hour12: false }).replace(/\//g, '-').split(' ')
        const len = await redis.llen(key)

        if(len) {
          redis.rpush(key, `${ip}-${time}-${path}`)
        } else {
          redis.lpush(key, `${ip}-${time}-${path}`)
        }
      },
      // 获得IP记录
      getIpLog(data) {
        return redis.lrange(data, 0, -1)
      },
    }
  }
}

