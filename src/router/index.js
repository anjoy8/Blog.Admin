import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login.vue'
import Welcome from '../views/Welcome'
import NotFound from "../views/403";
import Thanks from '../views/Thanks'
import Layout from "../views/Layout/Layout";
import store from "../store";
import {saveRefreshtime} from "../api/api";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/Thanks', component: Thanks, name: 'Thanks',
            meta: {
                title: 'Thanks',
                requireAuth: false
            },
            hidden: true
        },
        {
            path: '/',
            component: Welcome,
            name: 'QQ欢迎页',
            iconCls: 'fa-qq',//图标样式class
            // hidden: true,
            meta: {
                title: 'QQ欢迎页',
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            iconCls: 'fa-address-card',//图标样式class
            meta: {
                title: '登录',
                NoTabPage: true,
                NoNeedHome: true // 添加该字段，表示不需要home模板
            },
            hidden: true
        },
        {
            path: '*',
            hidden: true,
            redirect: {path: '/404'}
        }
    ]
})


export default router;

