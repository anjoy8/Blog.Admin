import Vue from 'vue'
import App from './App.vue'
// import router from './routerManuaConfig'
import store from './store'
import router from './router/index'
import '../util/global'//全局
import './promissionRouter'//这里进行路由后台获取的模拟

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);


// import Mock from './mock'
// Mock.bootstrap();

import 'font-awesome/css/font-awesome.min.css'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
