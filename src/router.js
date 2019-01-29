import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Table from './views/User/Table.vue'
import Form from './views/User/Form.vue'
import user from './views/User/user.vue'

Vue.use(Router)

export default new Router({
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
            path: '/404',
            component: NotFound,
            name: '',
            hidden: true
        },
        {
            path: '/',
            component: Home,
            name: '导航一',
            iconCls: 'el-icon-message',//图标样式class
            children: [
                {path: '/form', component: Form, name: 'Form'},
                {path: '/table', component: Table, name: '表格'},
                {path: '/user', component: user, name: '列表'},
                {path: '/login', component: Login, name: '登录'},
            ]
        },
        {
            path: '*',
            hidden: true,
            redirect: {path: '/404'}
        }
    ]
})
