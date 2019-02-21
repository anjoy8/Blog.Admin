import axios from 'axios';
import router from '../router'
import store from "../store";
import Vue from 'vue';

let base = '';

var storeTemp = store;
axios.interceptors.request.use(
    config => {
        var curTime = new Date()
        var expiretime = new Date(Date.parse(storeTemp.state.tokenExpire))

        if (storeTemp.state.token && (curTime < expiretime && storeTemp.state.tokenExpire)) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = "Bearer " + storeTemp.state.token;
        }
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

        if (error.response) {

            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.commit("saveToken", "");
                    store.commit("saveTokenExpire", "");
                    router.replace({
                        path: "/login",
                        query: {redirect: router.currentRoute.fullPath}
                    });
                case 403:
                    Vue.prototype.$message({
                        message: '无权限',
                        type: 'error'
                    });
                    // 返回 403 无权限
                    router.replace({
                        path: "/403",
                    });
            }
        }
        return Promise.reject(error.response.data); // 返回接口返回的错误信息
    }
);

// 登录
export const requestLogin = params => {
    return axios.get(`${base}/api/login/jwttoken3.0`, {params: params}).then(res => res.data);
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
    return axios.get(`${base}/api/user`, {params: params});
};
export const removeUser = params => {
    return axios.delete(`${base}/api/user`, {params: params});
};
export const editUser = params => {
    return axios.put(`${base}/api/user`, params);
};
export const addUser = params => {
    return axios.post(`${base}/api/user`, params);
};
export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params});
};

// 角色管理
export const getRoleListPage = params => {
    return axios.get(`${base}/api/role`, {params: params});
};
export const removeRole = params => {
    return axios.delete(`${base}/api/role`, {params: params});
};
export const editRole = params => {
    return axios.put(`${base}/api/role`, params);
};
export const addRole = params => {
    return axios.post(`${base}/api/role`, params);
};

// 接口模块管理
export const getModuleListPage = params => {
    return axios.get(`${base}/api/module`, {params: params});
};
export const removeModule = params => {
    return axios.delete(`${base}/api/module`, {params: params});
};
export const editModule = params => {
    return axios.put(`${base}/api/module`, params);
};
export const addModule = params => {
    return axios.post(`${base}/api/module`, params);
};


// 菜单模块管理
export const getPermissionListPage = params => {
    return axios.get(`${base}/api/permission`, {params: params});
};
export const removePermission = params => {
    return axios.delete(`${base}/api/permission`, {params: params});
};
export const editPermission = params => {
    return axios.put(`${base}/api/permission`, params);
};
export const addPermission = params => {
    return axios.post(`${base}/api/permission`, params);
};
export const getPermissionTree = params => {
    return axios.get(`${base}/api/permission/getpermissiontree`, {params: params});
};
