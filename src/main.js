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

import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
Vue.use(preview)

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
Viewer.setDefaults({
    Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});

//如果想使用 mock ，开启这两行即可，想看效果，看登录页的 mock登录功能
// import Mock from './mock'
// Mock.bootstrap();

import 'font-awesome/css/font-awesome.min.css'


Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
