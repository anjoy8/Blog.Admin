<template>
    <div>
        <div class="bg bg-blur"></div>
        <div style="height: 180px;"></div>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>

            <div style="margin-bottom: 20px;">
                <el-radio-group @change="loginAccount" v-model="account3">
                    <el-radio-button label="测试账号1"></el-radio-button>
                    <el-radio-button label="测试账号2"></el-radio-button>
                    <el-radio-button label="超级管理员"></el-radio-button>
                </el-radio-group>
            </div>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">
                    {{loginStr}}
                </el-button>

            </el-form-item>
            <el-form-item style="width:100%;">

                <el-button :loading="loginingMock" style="width:100%;" @click.native.prevent="handleSubmitMock">Mock登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {requestLogin, requestLoginMock, getUserByToken, getNavigationBar} from '../api/api';

    const _import = require('../router/_import_' + process.env.NODE_ENV)//获取组件的方法
    import router from '../router'
    import Layout from '../views/Layout/Layout.vue'//Layout 是架构组件，不在后台返回，在文件里单独引入

    export default {
        data() {
            return {
                instance: "",
                loginStr:'登录',
                logining: false,
                loginingMock: false,
                ruleForm2: {
                    account: 'test',
                    checkPass: 'test'
                },
                account3: '测试账号1',
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            loginAccount() {

                if (this.account3 == "测试账号1") {
                    this.ruleForm2.account = "test";
                    this.ruleForm2.checkPass = "test";
                } else if (this.account3 == "测试账号2") {
                    this.ruleForm2.account = "test2";
                    this.ruleForm2.checkPass = "test2";
                } else {
                    this.ruleForm2.account = "blogadmin";
                    this.ruleForm2.checkPass = "666";
                }
            },
            //这个是用来测试 mock 的，很简单，只需要在 main.js 中开启服务即可
            handleSubmitMock(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.loginingMock = true;
                        //NProgress.start();
                        var loginParams = {username: this.ruleForm2.account, password: this.ruleForm2.checkPass};

                        requestLoginMock(loginParams).then(data => {
                            this.loginingMock = false;

                            if (data && data.code && data.msg) {
                                _this.$message({
                                    message: data.code + data.msg + "，用户名admin,密码123456",
                                    type: 'error'
                                });
                            } else {

                                _this.$message({
                                    message: "测试mock，请在main.js 中开启服务!",
                                    type: 'error'
                                });
                                console.info('%c 测试mock，请在main.js 中开启服务!', "color:red")
                            }

                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            openAlert(msg) {
                this.instance = this.$notify({
                    title: '提示',
                    message: msg,
                    duration: 0,
                    position: 'top-left'
                });
            },
            closeAlert() {
                this.instance.close()
            },
            // 获取 Token
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;

                        //NProgress.start();
                        var loginParams = {name: this.ruleForm2.account, pass: this.ruleForm2.checkPass};


                        // _this.openAlert("登录中...")

                        _this.loginStr="登录中...";

                        requestLogin(loginParams).then(data => {

                            if (!data.success) {
                                _this.$message({
                                    message: data.message,
                                    type: 'error'
                                });
                                _this.logining = false;
                                _this.loginStr="重新登录";
                                _this.closeAlert()
                            } else {

                                var token = data.token;
                                _this.$store.commit("saveToken", token);

                                var curTime = new Date();
                                var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + data.expires_in));
                                _this.$store.commit("saveTokenExpire", expiredate);

                                window.localStorage.refreshtime = expiredate;

                                // _this.closeAlert()
                                // _this.openAlert("成功获取Token，等待服务器返回用户信息...")
                                _this.loginStr="成功获取Token，等待服务器返回用户信息...";

                                _this.getUserInfoByToken(token)


                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 获取用户数据
            getUserInfoByToken(token) {
                var _this = this;
                var loginParams = {token: token};
                getUserByToken(loginParams).then(data => {

                    if (!data.success) {
                        _this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    } else {
                        // _this.closeAlert()
                        // _this.openAlert("接收到用户数据，开始初始化路由树...")
                        _this.loginStr="接收到用户数据，开始初始化路由树...";

                        _this.$notify({
                            type: "success",
                            message: `登录成功 \n 欢迎管理员：${data.response.uRealName} ！`,
                            duration: 3000
                        });

                        window.localStorage.user = JSON.stringify(data.response)
                        if (data.response.uID > 0) {
                            _this.GetNavigationBar(data.response.uID)
                        }
                    }
                });
            },
            // 获取路由树
            GetNavigationBar(uid) {
                var _this = this;
                var loginParams = {uid: uid};

                getNavigationBar(loginParams).then(data => {
                    _this.logining = false;


                    if (!data.success) {
                        _this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    } else {

                        // _this.closeAlert()

                        _this.$message({
                            message: "后台初始化成功",
                            type: 'success'
                        });

                        window.localStorage.router = (JSON.stringify(data.response.children));

                        let getRouter = data.response.children//后台拿到路由
                        getRouter = filterAsyncRouter(getRouter) //过滤路由
                        router.addRoutes(getRouter) //动态添加路由

                        _this.$router.replace(_this.$route.query.redirect ? _this.$route.query.redirect : "/");
                    }
                });
            }
        },
        mounted() {
            // window.localStorage.clear()
            console.info('%c 本地缓存已清空!', "color:green")

        },
    }

    function filterAsyncRouter(asyncRouterMap) {
        //注意这里的 asyncRouterMap 是一个数组
        const accessedRouters = asyncRouterMap.filter(route => {
            if (route.path) {
                if (route.path === '/' || route.path === '-') {//Layout组件特殊处理
                    route.component = Layout
                } else {
                    try {
                        route.component = _import(route.path)
                    } catch (e) {
                        console.info('%c 当前路由 ' + route.path + '.vue 不存在，因此如法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!', "color:red")

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
</script>

<style>
    .bg {
        margin: 0px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url(../assets/loginbck.png) no-repeat top left;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 100%;
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

        position: relative;
    }

    .login-container .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .login-container .remember {
        margin: 0px 0px 25px 0px;
    }
</style>
