module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_SERVICE
  },
  productionSourceMap: false,
  pwa: {
    workboxOptions: {
      // 用于缓存workbox使用的名称
      cacheId: 'calabash-blog',
      // workbox是否应该识别删除旧的缓存
      // cleanupOutdatedCaches: true,
      // 构建后生成的service-worker文件, 相对于webpack输出路径
      swDest: 'service-worker.js',
      // workbox托管地址, 默认cdn, 但是被墙了
      importWorkboxFrom: 'local',
      // sw是否应该跳过等待的生命周期
      skipWaiting: true,
      // sw是否应该在激活后立即控制所有客户端
      clientsClaim: true,
      // 运行时缓存
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
              maxEntries: 5,
              maxAgeSeconds: 60
            },
          },
        },
      ],
      // 设定单页应用的app-shell
      navigateFallback: './index.html'
    },
  },
}
