const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const End = require('./EndWebpackPlugin')
const upload = require('./upload')
module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new BundleAnalyzerPlugin(),
          new SWPrecacheWebpackPlugin({
            cacheId: 'calabash-blog',
            filename: 'service-worker.js',
            staticFileGlobs: ['dist/**/*.{js,html,css,svg,woff,ttf}'],
            minify: true,
            stripPrefix: 'dist/',
            runtimeCaching: [
              {
                urlPattern: '/',
                handler: 'cacheFirst'
              },
              {
                urlPattern: '/:user',
                handler: 'cacheFirst'
              }
            ],
          }),
          new End(upload)
        ]
      }
    }
  },
}