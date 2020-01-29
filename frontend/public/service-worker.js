// get workbox from my OSS
importScripts("https://static.calabash.top/workbox-v4.0.0/workbox-sw.js");
workbox.setConfig({
  modulePathPrefix: 'https://static.calabash.top/workbox-v4.0.0',
  // debug: true
});

// Take over this tab after activated
workbox.core.clientsClaim();

// Set precache list
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Delete outdated cache
workbox.precaching.cleanupOutdatedCaches();
workbox.routing.registerRoute(
  // Filter navigate request
  ({event}) => {
    const isStaticFile = /\.\w+$/.test(event.request.url)
    return event.request.mode === 'navigate' && !isStaticFile
  },
  // Cache App shell: index.html
  ({url}) => {
    return new workbox.strategies.NetworkFirst({
      cacheName: 'calabash-blog-navigator',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 3,
          maxAgeSeconds: 864000,
          purgeOnQuotaError: false
        })
      ]
    }).handle({ request: `${url.origin}/index.html` })
  }
)
// Cache media
workbox.routing.registerRoute(
  new RegExp('^https://static.calabash.top/img'),
  ({url, event}) => {
    // Support webp?
    const supportWebp = event.request.headers.has('accept') &&
      event.request.headers.get('accept').includes('webp') &&
      /\.jpg$|.png$/.test(event.request.url)
    const request = supportWebp ? event.request.url += '?x-oss-process=style/webp' : event.request.url

    return new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'calabash-blog-media',
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

// New content avaliable
self.addEventListener('message', e => {
  if (!e.data) return
  if (e.data === 'skipWaiting') self.skipWaiting()
})
