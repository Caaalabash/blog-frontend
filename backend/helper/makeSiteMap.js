const fs = require('fs')

const writeFile = (dirPath, filename, fileData) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
  fs.writeFileSync(dirPath + filename, fileData)
}
/**
 * 后端生成sitemap站点地图, 提高SEO效果
 */
module.exports = app => {
  const { isProd } = app.app_config
  const { articleModel } = app.model

  return {
    makeSiteMap: async () => {
      if (!isProd) return
      console.log('make SiteMap' + new Date().toLocaleString('zh'))

      const data = await articleModel.find({ author: 'Calabash' }, { _id: 0, blogDate: 1 })
      const fileData = data
        .map(({ blogDate }) => `https://blog.calabash.top/Calabash/articles/${blogDate}`)
        .reduce((str, nextStr) => (str += nextStr + '\n'), 'https://blog.calabash.top/Calabash\n')

      writeFile('/data/sitemap/', 'sitemap.txt', fileData)
    }
  }
}