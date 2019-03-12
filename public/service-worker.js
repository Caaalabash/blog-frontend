// 从OSS上获取Workbox资源
importScripts("https://static.calabash.top/workbox-v4.0.0/workbox-sw.js");
workbox.setConfig({
  modulePathPrefix: 'https://static.calabash.top/workbox-v4.0.0',
  // debug: true
});

// ServiceWorker跳过waiting生命周期并在激活后立即控制客户端
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// 加载预缓存资源
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// 清除过期资源
workbox.precaching.cleanupOutdatedCaches();
// 指定APP SHELL
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("./index.html") || "./index.html");

// 缓存图片资源
workbox.routing.registerRoute(
  new RegExp('^https://static.calabash.top/img'),
  ({url, event}) => {
    // 需要转换为webp的资源: accept字段中含有webp && 资源为jpg/png
    const supportWebp = event.request.headers.has('accept') && event.request.headers.get('accept').includes('webp') && /\.jpg$|.png$/.test(event.request.url)
    const request = supportWebp ? event.request.url += '?x-oss-process=style/webp' : event.request.url
    return new workbox.strategies.StaleWhileRevalidate({
      "cacheName":"calabash-blog-media",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 864000,
          purgeOnQuotaError: false
        })
      ]
    }).handle({ request })
  },
  'GET'
);
// 缓存API请求
workbox.routing.registerRoute(
  /api/,
  new workbox.strategies.NetworkFirst({
    "cacheName":"calabash-blog-api",
    "networkTimeoutSeconds":7,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        maxAgeSeconds: 60,
        purgeOnQuotaError: false
      })
    ]
  }),
  'GET'
);
