import router from './router'
import {resetRouter} from './router/index'

const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
import Layout from './views/Layout/Layout.vue'//Layout 是架构组件，不在后台返回，在文件里单独引入
import {getNavigationBar, saveRefreshtime} from './api/api';
import store from "./store";



var getRouter //用来获取后台拿到的路由
if (!getRouter) {//不加这个判断，路由会陷入死循环

    if (!getObjArr('router')) {
        //本地没有，则从数据库获取
        var user = window.localStorage.user ? JSON.parse(window.localStorage.user) : null;
        if (user && user.uID > 0) {
            console.info(user.uID)
            var loginParams = {uid: user.uID};
            getNavigationBar(loginParams).then(data => {
                if (data.success) {
                    console.info('%c get navigation bar from api succeed!', "color:red")
                    getRouter = data.response.children//后台拿到路由
                    saveObjArr('router', getRouter) //存储路由到localStorage
                    // routerGo(to, next)//执行路由跳转方法
                }
            });
        }
    } else {
        //从localStorage拿到了路由
        console.info('%c get navigation bar from localStorage succeed!', "color:green")
        getRouter = getObjArr('router')//拿到路由
        getRouter = filterAsyncRouter(getRouter) //过滤路由
        router.addRoutes(getRouter) //动态添加路由
        global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    }
}

var storeTemp = store;
router.beforeEach((to, from, next) => {
    //验证Token
    {

        if (!storeTemp.state.token) {
            storeTemp.commit("saveToken", window.localStorage.Token)
        }
        if (!storeTemp.state.tokenExpire) {
            storeTemp.commit("saveTokenExpire", window.localStorage.TokenExpire)
        }
        saveRefreshtime();
        if (to.meta.requireAuth) {
            // 判断该路由是否需要登录权限
            var curTime = new Date()
            var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))
            if (storeTemp.state.token && storeTemp.state.token != "undefined") {
                // 通过vuex state获取当前的token是否存在
                next();
            } else {
                store.commit("saveToken", "");
                store.commit("saveTokenExpire", "");
                store.commit("saveTagsData", "");
                window.localStorage.removeItem('user');
                window.localStorage.removeItem('NavigationBar');
                window.localStorage.removeItem('router');

                next({
                    path: "/login",
                    query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
                });

                 window.location.reload()
            }
        } else {
            next();
        }
    }

    //动态添加路由
    {
        //不加这个判断，路由会陷入死循环
        if (!getRouter) {
            if (!getObjArr('router')) {
                var user = window.localStorage.user ? JSON.parse(window.localStorage.user) : null;
                if (user && user.uID > 0) {
                    var loginParams = {uid: user.uID};
                    getNavigationBar(loginParams).then(data => {
                        console.log('router before each get navigation bar from api succeed!')
                        if (data.success) {
                            getRouter = data.response.children//后台拿到路由
                            saveObjArr('router', getRouter) //存储路由到localStorage
                            routerGo(to, next)//执行路由跳转方法
                        }
                    });
                }
            } else {
                //从localStorage拿到了路由
                getRouter = getObjArr('router')//拿到路由
                routerGo(to, next)
            }
        } else {
            console.log(1)
           if(to.name&&to.name != 'login'){
               getRouter = getObjArr('router')//拿到路由
               global.antRouter = getRouter
               // routerGo(to, next)//执行路由跳转方法
           }
            next()

        }
    }
});


function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter) //过滤路由
    resetRouter()
    router.addRoutes(getRouter) //动态添加路由
    global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    next({...to, replace: true})
}

//localStorage 存储数组对象的方法
function saveObjArr(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}

//localStorage 获取数组对象的方法
function getObjArr(name) {
    return JSON.parse(window.localStorage.getItem(name));
}

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
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
