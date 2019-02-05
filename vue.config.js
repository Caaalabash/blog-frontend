const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new SWPrecacheWebpackPlugin({
            cacheId: 'calabash-blog',
            filename: 'service-worker.js',
            staticFileGlobs: ['dist/**/*.{js,html,css,svg,woff,ttf}'],
            minify: true,
            stripPrefix: 'dist/',
            dontCacheBustUrlsMatching: [/./],
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
            navigateFallback: '/index.html'
          }),
        ]
      }
    }
  },
}
