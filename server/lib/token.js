const redis = require('../redis/index')
const jwt = require('jsonwebtoken')
const SECRET ='CalabashBlog'

const redisTool = {
  //生成并设置token
  sign(user){
    let token = jwt.sign({user:user}, SECRET)
    redis.set(user,token)
    redis.expire(user,3600)
    return token
  },
  //更新user的token过期时间
  _update(user){
    redis.expire(user,3600)
  },
  _getValue(user){
    return redis.get(user).then(res=>res)
  },
  _delete(user){
    return redis.del(user).then(res=>res)
  },
  _check(user,token){
    return this._getValue(user).then(res=>{
      if(res === token){
        this._update(user)
        return true
      }else{
        return false
      }
    })
  },
  _incr(blog){
    redis.incr(blog)
    return this._getValue(blog).then(res=>res)
  },
  async ipLog(ip,path){
    let [key,time] = new Date().toLocaleString('zh', { hour12: false }).split(' ');
    let len = await redis.llen(key)
    if(len){
       redis.rpush(key,`${ip}-${time}-${path}`)
    }else{
       redis.lpush(key,`${ip}-${time}-${path}`)
    }
  },
  getIpLog(data){
     return redis.lrange(data,0,-1)
  },
  saveSubscription(key,value) {
    redis.sadd(key, value)
  },
  getSubscription(key){
    return redis.smembers(key)
  },
  removeSubscription(value){
    redis.srem('subscription',value)
  }
}

module.exports = redisTool


