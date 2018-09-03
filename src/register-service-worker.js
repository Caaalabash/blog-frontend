// Register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.
import api from './service/apiManage'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
)

const urlBase64ToUint8Array = function (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function register (swUrl, hooks) {
  const emit = (hook, ...args) => {
    if (hooks && hooks[hook]) {
      hooks[hook](...args)
    }
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, emit)
        navigator.serviceWorker.ready.then(() => {
          emit('ready')
        })
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl, emit)
      }
    })
  }
}

function registerValidSW (swUrl, emit) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      startSubscribe()
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              emit('updated')
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              emit('cached')
            }
          }
        }
      }
    })
    .catch(error => {
      emit('error', error)
    })
}

function startSubscribe () {
  if('PushManager' in window){
    navigator.serviceWorker.ready.then((swReg) => {
      console.log('PushManage registration success')
      swReg.pushManager.getSubscription().then(function(subscription){
        if(subscription){
          console.log(subscription)
        }else{
          console.log('start subscribe')
          swReg.pushManager.subscribe({
            userVisibleOnly:true,
            applicationServerKey:urlBase64ToUint8Array('BGO_lp81VuXZtSNm4WMK6_lsyspLAtP7bEvjS-wVFw093ctm5QFIV0Jze2bKsFofQl1PrGd6jaCMW6AeXzLFlto')
          }).then((res)=>{
            api.subscription({data:JSON.stringify(res)})
          }).catch(e=>{
            console.log('出错:'+e)
          }).finally(()=>{
            console.log('gg')
          })
        }
      })
    })
  }
  else{
    console.log('no PushManager')
  }
}

function checkValidServiceWorker (swUrl, emit) {
  // Check if the service worker can be found.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found.
        emit('error', new Error(`Service worker not found at ${swUrl}`))
        unregister()
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, emit)
      }
    })
    .catch(error => {
      if (!navigator.onLine) {
        emit('offline')
      } else {
        emit('error', error)
      }
    })
}

export function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
