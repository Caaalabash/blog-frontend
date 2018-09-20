import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './registerServiceWorker'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
import touchDirective from './directives/touch'
//Vue.use(VueSocketio, socketio('http://127.0.0.1:3000'), store);
Vue.use(VueSocketio, socketio('https://blog.calabash.top:3000'), store);
Vue.use(infiniteScroll)
Vue.use(ELEMENT)
Vue.directive('touch',touchDirective)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
