const { GenerateSW } = require('workbox-webpack-plugin')

module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new GenerateSW ({
            swDest: 'service-worker.js',
            importWorkboxFrom: 'local',
            skipWaiting: true,
            clientsClaim: true,
            cleanupOutdatedCaches: true,
            navigateFallback: './index.html',
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            runtimeCaching: [
              {
                urlPattern: /\.(?:png|svg|webp|jpg|jpeg|gif)$/,
                handler: 'staleWhileRevalidate',
                options: {
                  cacheName: 'calabash-blog-media',
                  expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 10 * 24 * 60 * 60
                  },
                },
              },
              {
                urlPattern: /api/,
                handler: 'networkFirst',
                options: {
                  networkTimeoutSeconds: 7,
                  cacheName: 'calabash-blog-api',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60
                  },
                },
              },
            ],
          })
        ]
      }
    }
  },
}
