import 'intersection-observer'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './registerServiceWorker'
import touchDirective from './directives/touch'
import {
  Select,
  Option,
  Button,
  Radio,
  Input,
  Pagination,
  Dialog,
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
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Popover);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Badge);
Vue.use(ColorPicker)
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.directive('touch',touchDirective)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
