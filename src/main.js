import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
const installPersistedStatePlugin = createPersistedStatePlugin()

import App from './App.vue'
import router from './router'

import '@/assets/js/iconfont.js'
import vMarked from '@/directives/marked'
import vObserver from '@/directives/observer'
import vResize from '@/directives/resize'
import vTouch from '@/directives/touch'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/notification/style/css'
// import './registerServiceWorker'

const app = createApp(App)
const pinia = createPinia()

pinia.use((context) => installPersistedStatePlugin(context))

app.directive('marked', vMarked)
app.directive('observer', vObserver)
app.directive('resize', vResize)
app.directive('touch', vTouch)
app.use(pinia)
app.use(router)

app.mount('#app')
