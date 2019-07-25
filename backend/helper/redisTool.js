/**
 * 项目中需要用到Redis操作的封装
 */
module.exports = app => {
  const { redis } = app.plugin

  return {
    redisTool: {
      /**
       * 获取某个值
       * @param {String} key - 键
       * @return {Promise} 值
       */
      get(key) {
        return redis.get(key)
      },
      /**
       * 删除某个值
       * @param {String} key - 键
       * @return {Promise} 值
       */
      delete(key) {
        return redis.del(key)
      },
      /**
       * 为某个值加一
       * @param {String} key - 键
       * @return {Promise} 值
       */
      incr(key) {
        return redis.incr(key)
      },
      /**
       * 获取IP记录
       * @param {String} date - 日期: YYYY-MM-DD
       * @return {Promise}
       */
      getIpLog(date) {
        return redis.lrange(date, 0, -1)
      },
      /**
       * 记录操作
       * @param {String} ip - ip地址
       * @param {String} path - 访问路径
       */
      async setIpLog(ip, path) {
        const date = new Date()
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const len = await redis.llen(dateString)

        len
            ? redis.rpush(dateString, `${ip}-${timeString}-${path}`)
            : redis.lpush(dateString, `${ip}-${timeString}-${path}`)
      },

    }
  }
}

