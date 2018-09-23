module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false
}