const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')
const WebpackAliyunOssPlugin = require('webpack-aliyun-oss-plugin')

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  /**
   * @description 开发环境下代理
   * 1. 将所有 /api 开头的请求转发到 API服务器
   * 2. 将所有 /socket 开头的websocket请求转发到API服务器
   */
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    }
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
            exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /index\.html/, /^service-worker\.js$/],
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
  css: {
    extract: false
  },
}
