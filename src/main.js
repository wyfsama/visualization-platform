import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/css/global.less'
import { BASE_URL } from '@/config'
// import SocketService from '@/utils/socket_service'
// 对服务端连接
// SocketService.Instance.connect()
// 配置请求基准路线
axios.defaults.baseURL = BASE_URL
console.log(BASE_URL)
// 挂载axios
Vue.prototype.$http = axios
// 挂载echarts
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
