import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome'
import Thanks from '../views/Thanks'
import NoPage from '../views/404'

import Layout from "../views/Layout/Layout";
const _import = require('@/router/_import_' + process.env.NODE_ENV)//获取组件的方法

Vue.use(Router)

const createRouter = () => new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/404', component: NoPage, name: 'NoPage',
            meta: {
                title: 'NoPage',
                requireAuth: false,
                NoTabPage: true,
                NoNeedHome: true // 添加该字段，表示不需要home模板
            },
            hidden: true
        },
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

const router = createRouter()

export function  filterAsyncRouter(asyncRouterMap) {
    //注意这里的 asyncRouterMap 是一个数组
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.path) {
            if (route.path === '/'||route.path === '-') {//Layout组件特殊处理
                route.component = Layout
            } else {
                try {
                    route.component = _import(route.path)
                }catch (e) {
                    console.info('%c 当前路由 '+route.path+'.vue 不存在，因此如法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!', "color:red")

                }
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })

    return accessedRouters
}

export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // the relevant part
}

export default router;

