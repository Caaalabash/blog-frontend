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
  Select,
  Option,
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
  DatePicker,
  Badge,
  Popover,
  Form,
  FormItem,
  TabPane,
  Icon,
  ColorPicker,
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
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Icon,
  Upload,
  Badge,
  ColorPicker,
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
