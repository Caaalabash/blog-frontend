import Vue from 'vue'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'

Vue.config.productionTip = false
Vue.use(ELEMENT)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
