const jwt = require('jsonwebtoken')

/**
 * 项目中需要用到Redis操作的封装
 */
module.exports = app => {
  const { redis } = app.plugin
  const { secret } = app.app_config.jwt

  return {
    redisTool: {
      // 获得某个值, 返回一个Promise
      get(key) {
        return redis.get(key) || 0
      },
      // 删除某个值, 返回一个Promise
      delete(key) {
        return redis.del(key)
      },
      // 为键值加一, 不存在会被初始化为0, 返回一个Promise
      incr(key) {
        return redis.incr(key)
      },
      // 用户相关: 记录/签发token, 过期时间为一小时
      signToken(user) {
        const token = jwt.sign({ user }, secret)
        redis.set(user, token, 'EX', 3600)

        return token
      },
      // 用户相关: 重置token过期时间
      updateToken(user) {
        redis.expire(user, 3600)
      },
      // 用户相关: token校验
      async checkToken(user, expect) {
        const storeValue = await redis.get(user)

        if (storeValue !== expect) return false
        this.updateToken(user)
        return true
      },
      // 获得所有IP记录
      getIpLog(data) {
        return redis.lrange(data, 0, -1)
      },
      // 记录ip
      async setIpLog(ip, path) {
        const [key, time] = new Date()
          .toLocaleString('zh', { hour12: false })
          .replace(/\//g, '-')
          .split(' ')
        const len = await redis.llen(key)

        len ? redis.rpush(key, `${ip}-${time}-${path}`) : redis.lpush(key, `${ip}-${time}-${path}`)
      },

    }
  }
}

