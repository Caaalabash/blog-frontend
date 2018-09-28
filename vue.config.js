const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new BundleAnalyzerPlugin()
        ]
      }
    }
  }
}