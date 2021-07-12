import Vue from 'vue'
import App from './App.vue'
// import router from './routerManuaConfig'
import store from './store'
import router from './router/index'
import '../util/global'//全局
import './promissionRouter'//这里进行路由后台获取的模拟
import i18n from './lang' // Internationalization
import Cookies from 'js-cookie'

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});

//如果想使用 mock ，开启这两行即可，想看效果，看登录页的 mock登录功能
// import Mock from './mock'
// Mock.bootstrap();

import 'font-awesome/css/font-awesome.min.css'

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
