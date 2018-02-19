import Vue from 'vue'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import store from './store'

Vue.config.productionTip = false

Vue.use(ELEMENT)


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
