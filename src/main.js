import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './registerServiceWorker'

import touchDirective from './directives/touch'

Vue.use(infiniteScroll)
Vue.use(ELEMENT)
Vue.directive('touch',touchDirective)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
