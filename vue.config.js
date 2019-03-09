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
            swSrc: path.join('./src', 'service-worker.js'),
            dontCacheBustUrlsMatching: /\.\w{8}\./
          }),
          new WebpackAliyunOssPlugin({
            region: 'oss-cn-beijing',
            bucket: 'calabash-static',
            ak: process.env.ossak,
            sk: process.env.osssk,
            filter: function (asset) {
              return !/(\.html|\.map)$/.test(asset)
            },
          })
        ]
      }
    }
  },
}
