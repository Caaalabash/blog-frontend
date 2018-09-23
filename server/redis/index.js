const Redis = require("ioredis");
const config = require('../config')
const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password
});

redis.on("connect", function () {
  console.log('连接redis成功');
});

redis.on("error", function (error) {
  console.log(error);
})

module.exports = redis
