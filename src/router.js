import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from "./store";

import Login from './views/Login.vue'
import NotFound from './views/403.vue'
import Table from './views/User/Table.vue'
import Form from './views/User/Form.vue'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            component: Login,
            name: '',
            hidden: true
        },
        {
            path: '/',
            component: Home,
            name: '导航一',
            iconCls: 'el-icon-message',//图标样式class
            children: [
                {
                    path: '/form', component: Form, name: 'Form',
                    meta: {
                        requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/table', component: Table, name: '表格',
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: '/403',component: NotFound,name: '',
                    hidden: true
                },
            ]
        },
        {
            path: '*',
            hidden: true,
            redirect: {path: '/404'}
        }
    ]
})

var storeTemp = store;
router.beforeEach((to, from, next) => {

    if (!storeTemp.state.token) {
        storeTemp.commit("saveToken", window.localStorage.Token)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        var curTime = new Date()
        var expiretime = new Date(Date.parse(window.localStorage.TokenExptire))

        if (storeTemp.state.token && storeTemp.state.token != "undefined" && (curTime < expiretime && window.localStorage.TokenExptire)) {
            // 通过vuex state获取当前的token是否存在
            next();
        } else {
            next({
                path: "/login",
                query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        next();
    }
});

export default router;
