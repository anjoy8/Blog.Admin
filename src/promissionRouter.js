import router from '@/router'
import { resetRouter, filterAsyncRouter } from '@/router/index'

import { getNavigationBar, saveRefreshtime } from '@/api/api';
import store from "@/store";

import applicationUserManager from "./Auth/applicationusermanager";

//用来获取后台拿到的路由
var getRouter
if (!getRouter) {//不加这个判断，路由会陷入死循环
    if (!getObjArr('router')) {
        //本地没有，则从数据库获取
        var user = window.localStorage.user ? JSON.parse(window.localStorage.user) : null;
        if (user && user.uID > 0) {
            console.info(user.uID)
            var loginParams = { uid: user.uID };
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
        router.$addRoutes(getRouter) //动态添加路由
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
                console.log(1)
                next();
            } else {
                store.commit("saveToken", "");
                store.commit("saveTokenExpire", "");
                store.commit("saveTagsData", "");
                window.localStorage.removeItem('user');
                window.localStorage.removeItem('NavigationBar');
                window.localStorage.removeItem('router');

                
                if (global.IS_IDS4) {
                applicationUserManager.login();
                }else{
                    next({
                        path: "/login",
                        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    });

                    //window.location.reload()
                }

            }
        } else {          
            console.log(2)
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
                    var loginParams = { uid: user.uID };
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

            if (to.name && to.name != 'login') {
                getRouter = getObjArr('router')//拿到路由
                global.antRouter = getRouter
                // routerGo(to, next)//执行路由跳转方法
            }
            // console.log(3)
            // next()

        }
    }
});


function routerGo(to, next) {

    //过滤路由
    getRouter = filterAsyncRouter(getRouter)
    resetRouter()

    //动态添加路由
    router.$addRoutes(getRouter)

    //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    global.antRouter = getRouter
    next({ ...to, replace: true })
}

//localStorage 存储数组对象的方法
function saveObjArr(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}

//localStorage 获取数组对象的方法
function getObjArr(name) {
    return JSON.parse(window.localStorage.getItem(name));
}


var buttonList = [];


export const getButtonList = (routePath,routers) => {
    routers.forEach(element => {
        if (routePath&&element.path) {
            let path = routePath.toLowerCase();
            if (element.path && element.path.toLowerCase() === path) {
                buttonList = element.children;
                return;
            } else if (element.children) {
                getButtonList(path,element.children);
            }
        }
    });
    return buttonList;
};


