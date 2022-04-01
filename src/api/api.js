import axios from 'axios';
// import router from '../routerManuaConfig'
import router from '../router/index'
import store from "../store";
import Vue from 'vue';

import applicationUserManager from "../Auth/applicationusermanager";

let base = '';
// 如果是IIS部署，用这个，因为 IIS 只能是 CORS 跨域，不能代理
// let base = process.env.NODE_ENV=="production"? 'http://localhost:8081':'';


// 请求延时
axios.defaults.timeout = 20000

var storeTemp = store;
axios.interceptors.request.use(
    config => {
        var curTime = new Date()
        var expiretime = new Date(Date.parse(storeTemp.state.tokenExpire))

        if (storeTemp.state.token && (curTime < expiretime && storeTemp.state.tokenExpire)) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = "Bearer " + storeTemp.state.token;
        }

        saveRefreshtime();

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => { 
        return response; 
    },
    error => {
        let errInfo = { success: false, message: "错误" }
        // 超时请求处理
        var originalRequest = error.config;
        if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
            errInfo.message = "请求超时！"; 
            originalRequest._retry = true 
        }else if (error.response) {
            if (error.response.status == 401) {
                var curTime = new Date()
                var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
                // 在用户操作的活跃期内
                if (window.localStorage.refreshtime && (curTime <= refreshtime)) {
                    return  refreshToken({token: window.localStorage.Token}).then((res) => {
                        if (res.success) {
                            Vue.prototype.$message({
                                message: 'refreshToken success! loading data...',
                                type: 'success'
                            });

                            store.commit("saveToken", res.response.token);

                            var curTime = new Date();
                            var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + res.response.expires_in));
                            store.commit("saveTokenExpire", expiredate);

                            error.config.__isRetryRequest = true;
                            error.config.headers.Authorization = 'Bearer ' + res.response.token;
                            return axios(error.config);
                        } else {
                            // 刷新token失败 清除token信息并跳转到登录页面
                            ToLogin()
                        }
                    });
                } else {
                    // 返回 401，并且不知用户操作活跃期内 清除token信息并跳转到登录页面
                    ToLogin()
                }

            }
            // 403 无权限
            else if (error.response.status == 403) {
               errInfo.message = "失败！该操作无权限"; 
            }
            // 429 ip限流
            else if (error.response.status == 429) {
                errInfo.message = "刷新次数过多，请稍事休息重试！";
            }else if (error.response.status == 404) {
                // 404 不存在
                errInfo.message = "失败！访问接口不存在";
           }else if (error.response.status == 500) {
               // 500 服务器异常
               errInfo.message = "失败！服务器异常"; 
           }else if (error.response.status == 405) {
               // 405 请求http方法错误
               errInfo.message = "失败！请求http方法错误";  
           }else if (error.response.status == 415) {
               // 415 参数没有指定Body还是Query
               errInfo.message = "失败！参数没有指定Body还是Query";   
           }else {
               //其他错误参数
                errInfo.message = '失败！请求错误' + error.response.status;    
           }
        }else{
            errInfo.message = "失败！服务器断开";  
        }
        Vue.prototype.$message({
            message: errInfo.message,
            type: 'error'
        });
        return errInfo; // 返回接口返回的错误信息
    }
);


export const BaseApiUrl =base;

// 登录
export const requestLogin = params => {
    return axios.get(`${base}/api/login/jwttoken3.0`, {params: params}).then(res => res.data);
};
export const requestLoginMock = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const refreshToken = params => {
    return axios.get(`${base}/api/login/RefreshToken`, {params: params}).then(res => res.data);
};

export const saveRefreshtime = params => {

    let nowtime = new Date();
    let lastRefreshtime = window.localStorage.refreshtime ? new Date(window.localStorage.refreshtime) : new Date(-1);
    let expiretime = new Date(Date.parse(window.localStorage.TokenExpire))

    let refreshCount=1;//滑动系数
    if (lastRefreshtime >= nowtime) {
        lastRefreshtime=nowtime>expiretime ? nowtime:expiretime;
        lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
        window.localStorage.refreshtime = lastRefreshtime;
    }else {
        window.localStorage.refreshtime = new Date(-1);
    }
};
 const ToLogin = params => {
     
     store.commit("saveToken", "");
     store.commit("saveTokenExpire", "");
     store.commit("saveTagsData", "");
     window.localStorage.removeItem('user');
     window.localStorage.removeItem('NavigationBar');

     
                
    if (global.IS_IDS4) {
        applicationUserManager.login();
    } else {
        router.replace({
            path: "/login",
            query: {redirect: router.currentRoute.fullPath}
        }); 
        //window.location.reload()
    }
};

export const getUserByToken = params => {
    return axios.get(`${base}/api/user/getInfoByToken`, {params: params}).then(res => res.data);
};


export function testapi2() {
    console.log('api is ok.')
}

export const testapi = pa => {
    console.log('api is ok.')
}

// 用户管理
export const getUserListPage = params => {
    return axios.get(`${base}/api/user/get`, {params: params});
};
export const removeUser = params => {
    return axios.delete(`${base}/api/user/delete`, {params: params});
};
export const editUser = params => {
    return axios.put(`${base}/api/user/put`, params);
};
export const addUser = params => {
    return axios.post(`${base}/api/user/post`, params);
};
export const batchRemoveUser = params => {
    return axios.delete(`${base}/api/Claims/BatchDelete`, {params: params});//没做
};

// 角色管理
export const getRoleListPage = params => {
    return axios.get(`${base}/api/role/get`, {params: params});
};
export const removeRole = params => {
    return axios.delete(`${base}/api/role/delete`, {params: params});
};
export const editRole = params => {
    return axios.put(`${base}/api/role/put`, params);
};
export const addRole = params => {
    return axios.post(`${base}/api/role/post`, params);
};

// 接口模块管理
export const getModuleListPage = params => {
    return axios.get(`${base}/api/module/get`, {params: params});
};
export const removeModule = params => {
    return axios.delete(`${base}/api/module/delete`, {params: params});
};
export const editModule = params => {
    return axios.put(`${base}/api/module/put`, params);
};
export const addModule = params => {
    return axios.post(`${base}/api/module/post`, params);
};


// 菜单模块管理
export const getPermissionListPage = params => {
    return axios.get(`${base}/api/permission/get`, {params: params});
};
export const getPermissionTreeTable = params => {
    return axios.get(`${base}/api/permission/GetTreeTable`, {params: params});
};
export const removePermission = params => {
    return axios.delete(`${base}/api/permission/delete`, {params: params});
};
export const editPermission = params => {
    return axios.put(`${base}/api/permission/put`, params);
};
export const addPermission = params => {
    return axios.post(`${base}/api/permission/post`, params);
};
export const getPermissionTree = params => {
    return axios.get(`${base}/api/permission/getpermissiontree`, {params: params});
};
export const getPermissionIds = params => {
    return axios.get(`${base}/api/permission/GetPermissionIdByRoleId`, {params: params});
};

export const addRolePermission = params => {
    return axios.post(`${base}/api/permission/Assign`, params);
};
export const getNavigationBar = params => {
    return axios.get(`${base}/api/permission/GetNavigationBar`, {params: params}).then(res => res.data);
};

// Bug模块管理
export const getBugListPage = params => {
    return axios.get(`${base}/api/TopicDetail/get`, {params: params});
};
export const removeBug = params => {
    return axios.delete(`${base}/api/TopicDetail/delete`, {params: params});
};
export const editBug = params => {
    return axios.put(`${base}/api/TopicDetail/update`, params);
};
export const addBug = params => {
    return axios.post(`${base}/api/TopicDetail/post`, params);
};


// 博客模块管理
export const getBlogListPage = params => {
    return axios.get(`${base}/api/Blog`, {params: params});
};
export const getBlogDeatil = params => {
    return axios.get(`${base}/api/Blog/DetailNuxtNoPer`, {params: params});
};
export const editBlog = params => {
    return axios.put(`${base}/api/Blog/update`, params);
};
export const removeBlog = params => {
    return axios.delete(`${base}/api/Blog/delete`, {params: params});
};

// 日志
export const getLogs = params => {
    return axios.get(`${base}/api/Monitor/get`, {params: params});
};
export const getRequestApiinfoByWeek = params => {
    return axios.get(`${base}/api/Monitor/GetRequestApiinfoByWeek`, {params: params});
};
export const getAccessApiByDate = params => {
    return axios.get(`${base}/api/Monitor/GetAccessApiByDate`, {params: params});
};
export const getAccessApiByHour = params => {
    return axios.get(`${base}/api/Monitor/GetAccessApiByHour`, {params: params});
};
export const getServerInfo = params => {
    return axios.get(`${base}/api/Monitor/Server`, {params: params});
};
export const getAccessLogs = params => {
    return axios.get(`${base}/api/Monitor/GetAccessLogs`, {params: params});
};
export const getIds4UsersGrow = params => {
    return axios.get(`${base}/api/Monitor/GetIds4Users`, {params: params});
};
export const getActiveUsers = params => {
    return axios.get(`${base}/api/Monitor/GetActiveUsers`, {params: params});
};


// Task管理
export const getTaskListPage = params => {
    return axios.get(`${base}/api/TasksQz/get`, {params: params});
};
export const removeTask = params => {
    return axios.delete(`${base}/api/TasksQz/delete`, {params: params});
};
export const editTask = params => {
    return axios.put(`${base}/api/TasksQz/put`, params);
};
export const addTask = params => {
    return axios.post(`${base}/api/TasksQz/post`, params);
};

export const startJob = params => {
    return axios.get(`${base}/api/TasksQz/StartJob`, {params: params});
};
export const stopJob = params => {
    return axios.get(`${base}/api/TasksQz/StopJob`, {params: params});
};
export const reCovery = params => {
    return axios.get(`${base}/api/TasksQz/ReCovery`, {params: params});
};
export const pauseJob = params => {
    return axios.get(`${base}/api/TasksQz/PauseJob`, {params: params});
};
export const resumeJob = params => {
    return axios.get(`${base}/api/TasksQz/ResumeJob`, {params: params});
};
export const getTaskNameSpace = params => {
    return axios.get(`${base}/api/TasksQz/GetTaskNameSpace`, {params: params});
};

// ids4
export const getAchieveUsers_IS4 = params => {
    return axios.get(`${base}/is4api/GetAchieveUsers`, {params: params});
};


//微信公众号
export const getWeChatAccount = params => {
    return axios.get(`${base}/api/WeChatConfig/get`, { params: params });
};
export const removeWeChatAccount = params => {
    return axios.delete(`${base}/api/WeChatConfig/delete`, { params: params });
};
export const batchDeleteChatAccount = params => {
    return axios.delete(`${base}/api/WeChatConfig/BatchDelete`, { params: params });
};
export const addWeChatAccount = params => {
    return axios.post(`${base}/api/WeChatConfig/post`, params);
};
export const updateWeChatAccount = params => {
    return axios.put(`${base}/api/WeChatConfig/put`, params);
};
export const getWeChatTemplate = params => {
    return axios.get(`${base}/api/WeChat/GetTemplate`, { params: params });//获取模板
};
export const refreshWeChatToken = params => {
    return axios.get(`${base}/api/WeChat/RefreshToken`, { params: params });//更新Token
};
export const getWeChatMenu = params => {
    return axios.get(`${base}/api/WeChat/GetMenu`, { params: params });//获取微信菜单
};
export const updateWeChatMenu = params => {
    return axios.put(`${base}/api/WeChat/updateMenu`, params);//更新微信菜单
};
export const getWeChatCompany = params => {
    return axios.get(`${base}/api/WeChatCompany/get`, { params: params });
};
export const removeWeChatCompany = params => {
    return axios.delete(`${base}/api/WeChatCompany/delete`, { params: params });
};
export const batchDeleteWeChatCompany = params => {
    return axios.delete(`${base}/api/WeChatCompany/BatchDelete`, { params: params });
};
export const addWeWeChatCompany = params => {
    return axios.post(`${base}/api/WeChatCompany/post`, params);
};
export const updateWeChatCompany = params => {
    return axios.put(`${base}/api/WeChatCompany/put`, params);
};
export const getWeChatPushLog = params => {
    return axios.get(`${base}/api/WeChatPushLog/get`, { params: params });
}; 
export const getWeChatSubUser = params => {
    return axios.get(`${base}/api/WeChat/GetSubUsers`, { params: params });
};
export const getWeChatBindUser = params => {
    return axios.get(`${base}/api/WeChatSub/get`, { params: params });
};
export const pushTestMsg = params => {
    return axios.post(`${base}/api/WeChat/PushTxtMsg`, params);
};
export const pushCardMsg = params => {
    return axios.post(`${base}/api/WeChat/PushCardMsg`, params);
};

// 部门模块管理
export const getDepartmentListPage = params => {
    return axios.get(`${base}/api/department/get`, {params: params});
};
export const getDepartmentTreeTable = params => {
    return axios.get(`${base}/api/department/getTreeTable`, {params: params});
};

export const removeDepartment = params => {
    return axios.delete(`${base}/api/department/delete`, {params: params});
};
export const editDepartment = params => {
    return axios.put(`${base}/api/department/put`, params);
};
export const addDepartment = params => {
    return axios.post(`${base}/api/department/post`, params);
};
export const getDepartmentTree = params => {
    return axios.get(`${base}/api/department/getDepartmentTree`, {params: params});
};