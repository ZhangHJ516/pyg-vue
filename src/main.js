// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import CusBread from '@/components/cusBread.vue'
import router from './router'
import moment from 'moment'
import axios from 'axios'
axios.defaults.baseURL="http://localhost:8888/api/private/v1/"
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */

//全局过滤器 - 处理日期格式
Vue.filter('fmtdate',(v)=> {
  return moment(v).format('YYYY-MM-DD');
})

//全局自定义面包屑组件
Vue.component(CusBread.name, CusBread);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
