//获取用户某个属性
const getUserProp = app => async (user, key) => {
  const doc = await app.model.userModel.findOne({ 'userName': user }, { [key]: 1, _id: 0 })
  if(doc && doc[key]){
    return doc[key]
  }
  return ''
}
//api v1
const response = (errno = 0,res = '',msg = '',token = '') => {
  return token
    ? { errno, res, msg, token}
    : { errno, res, msg,}
}
//api v2
const rsp = (errno, data, msg) => ({ errno, data, msg })

module.exports = app => ({
  response,
  rsp,
  getUserProp: getUserProp(app)
})
