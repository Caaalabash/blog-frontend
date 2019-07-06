const OSS = require('ali-oss')

module.exports = app => {
  const { alioss } = app.app_config
  let oss

  try {
    oss = new OSS(alioss)
  } catch (e) {
    console.log('alioss初始化失败')
    oss = {}
  }
  return oss
}