import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout/Layout.vue'
import store from "./store";

import Login from './views/Login.vue'
import NotFound from './views/403.vue'
import Welcome from './views/Welcome'

import Table from './views/User/Users.vue'
import Roles from './views/User/Roles.vue'

import Module from './views/Permission/Module.vue'
import Permission from './views/Permission/Permission.vue'

Vue.use(Router)


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/403', component: NotFound, name: 'NotFound',
            meta: {
                title: '首页',
                NoTabPage: true,
                requireAuth: false
            },
            hidden: true
        },
        {
            path: '/',
            component: Welcome,
            name: 'QQ欢迎页',
            iconCls: 'fa fa-qq',//图标样式class
            // hidden: true,
            meta: {
                title: 'QQ欢迎页',
                requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            iconCls: 'fa fa-address-card',//图标样式class
            meta: {
                title: '登录',
                NoTabPage: true,
                requireHome: true // 添加该字段，表示进入这个路由是需要登录的
            },
            hidden: true
        },
        {
            path: '/Admin',
            component: Layout,
            name: '用户角色管理',
            iconCls: 'fa fa-users',//图标样式class
            children: [
                {
                    path: 'Users', component: Table, name: '用户管理',
                    meta: {
                        title: '用户管理',
                        requireAuth: true
                    }
                },
                {
                    path: 'Roles', component: Roles, name: '角色管理',
                    meta: {
                        title: '角色管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
            ]
        },
        {
            path: '/Permission',
            component: Layout,
            name: '菜单权限管理',
            iconCls: 'fa fa-sitemap',//图标样式class
            children: [
                {
                    path: 'Modules', component: Module, name: '接口管理',
                    meta: {
                        title: '接口管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: 'Menu', component: Permission, name: '菜单管理',
                    meta: {
                        title: '菜单管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
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
    if (!storeTemp.state.tokenExpire) {
        storeTemp.commit("saveTokenExpire", window.localStorage.TokenExpire)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        var curTime = new Date()
        var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))

        if (storeTemp.state.token && storeTemp.state.token != "undefined" && (curTime < expiretime && window.localStorage.TokenExpire)) {

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
