const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')
const WebpackAliyunOssPlugin = require('webpack-aliyun-oss-plugin')


module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  publicPath: process.env.NODE_ENV === 'production' ? 'https://static.calabash.top/blog' : '/',
  productionSourceMap: false,
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new InjectManifest({
            importWorkboxFrom: 'disabled',
            swDest: 'service-worker.js',
            swSrc: path.join('./public', 'service-worker.js'),
            exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /index\.html/],
          }),
          new WebpackAliyunOssPlugin({
            region: 'oss-cn-beijing',
            bucket: 'calabash-static',
            ak: process.env.PROD_OSS_AK,
            sk: process.env.PROD_OSS_SK,
            filter: function (asset) {
              return !/(\.html|\.map)$/.test(asset)
            },
          })
        ]
      }
    }
  },
}
