/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { Notification } from 'element-ui'

const baseURL = process.env.NODE_ENV === 'production' ? 'https://blog.calabash.top' : location.origin

if ('serviceWorker' in navigator) {
  register(`${baseURL}/service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
      let refresh
      if (refresh) return
      Notification({
        title: '更新',
        message: '有新的内容可用, 关闭后将自动更新',
        duration: 0,
        onClose: () => {
          registration.waiting.postMessage({ data: 'skipWaiting' })
          refresh = true
        }
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
