const fs = require('fs')
//获取用户某个属性
const getUserProp = app => async (user, key) => {
  const doc = await app.model.userModel.findOne({ 'userName': user }, { [key]: 1, _id: 0 })
  if(doc && doc[key]){
    return doc[key]
  }
  return ''
}
// 生成生产环境下站点地图
const makeSiteMap = app => async () => {
  if (!app.app_config.isProd) return

  console.log('make SiteMap' + new Date().toLocaleString('zh'))
  const filter = { _id: 0, blogDate: 1 }
  const data = await app.model.blogModel.find({ author: 'Calabash' }, filter)
  const path = '/data/sitemap/sitemap.txt'
  const string = data
    .map(({ blogDate }) => `https://blog.calabash.top/Calabash/articles/${blogDate}`)
    .reduce((str, nextStr) => (str += nextStr + '\n'), '')

  if (!fs.existsSync('/data/sitemap')) fs.mkdirSync('/data/sitemap')
  fs.writeFileSync(path, string)
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
  getUserProp: getUserProp(app),
  makeSiteMap: makeSiteMap(app)
})
