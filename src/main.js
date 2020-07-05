import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'


import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log('main config:', config)
  return config
})


// 这样每一个vue组件都可以通过this.$http来访问axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 这是入口文件
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
