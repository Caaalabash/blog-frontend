import 'intersection-observer'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import touchDirective from './directives/touch'
import resizeDirective from './directives/resize'
import observerDirective from './directives/observer'
import markedDirective from './directives/marked'
import api from './service/apiManage'
import './registerServiceWorker'
import '@/assets/js/iconfont.js'
import {
  Button,
  Radio,
  Input,
  Pagination,
  Dialog,
  Notification,
  Upload,
  Menu,
  Submenu,
  MenuItem,
  Tabs,
  Table,
  TableColumn,
  Form,
  FormItem,
  TabPane,
  Icon,
  Loading,
  Message,
} from 'element-ui'

[
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Radio,
  Button,
  Table,
  TableColumn,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Icon,
  Upload,
  Loading.directive
].map(component => Vue.use(component))

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$api = api

Vue.directive('touch',touchDirective)
Vue.directive('resize',resizeDirective)
Vue.directive('observer', observerDirective)
Vue.directive('marked', markedDirective)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
