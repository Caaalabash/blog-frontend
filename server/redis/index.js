const Redis = require("ioredis");
const redis = new Redis();
const updateNginx = require('../lib/check').updateNginxConf

redis.on("connect", function () {
  console.log('连接redis成功');
  // updateNginx().then(res=>{
  //   console.log('重启了Nginx')
  // })
});

redis.on("error", function (error) {
  console.log(error);
})

module.exports = redis
