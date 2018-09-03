const users = require('../model/users')

//获取用户某个属性
async function getUserProp(user,key){
  let doc = await users.findOne({'userName':user},{[key]:1,_id:0})
  if(doc && doc[key]){
    return doc[key]
  }
  return ''
}
//api v1
const response = function(errno=0,res='',msg='',token=''){
  return token
    ? { errno, res, msg, token}
    : { errno, res, msg,}
}
//api v2
function rsp(errno=0,data='',msg=''){
  return {errno,data,msg}
}

module.exports = {
  response,
  getUserProp,
  rsp
}
