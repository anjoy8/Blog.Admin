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
                    <el-radio-button label="超级管理员" disabled ></el-radio-button>
                </el-radio-group>
            </div>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">
                    登录
                </el-button>
                <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {requestLogin, getUserByToken, getNavigationBar} from '../api/api';

    export default {
        data() {
            return {
                logining: false,
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
                } else {
                    this.ruleForm2.account = "test2";
                    this.ruleForm2.checkPass = "test2";
                }
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams = {name: this.ruleForm2.account, pass: this.ruleForm2.checkPass};

                        requestLogin(loginParams).then(data => {
                            this.logining = false;

                            if (!data.success) {
                                _this.$message({
                                    message: data.message,
                                    type: 'error'
                                });
                            } else {

                                _this.$notify({
                                    type: "success",
                                    message: "登录成功!",
                                    duration: 3000
                                });

                                var token = data.token;
                                _this.$store.commit("saveToken", token);

                                var curTime = new Date();
                                var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + data.expires_in));
                                _this.$store.commit("saveTokenExpire", expiredate);

                                _this.getUserInfoByToken(token)


                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getUserInfoByToken(token) {
                var _this = this;
                var loginParams = {token: token};
                getUserByToken(loginParams).then(data => {
                    this.logining = false;

                    if (!data.success) {
                        _this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    } else {

                        _this.$notify({
                            type: "success",
                            message: `欢迎管理员：${data.response.uRealName} ！`,
                            duration: 3000
                        });

                        window.localStorage.user = JSON.stringify(data.response)
                        if (data.response.uID > 0) {
                            _this.GetNavigationBar(data.response.uID)
                        }
                    }
                });
            },
            GetNavigationBar(uid) {
                var _this = this;
                var loginParams = {uid: uid};

                getNavigationBar(loginParams).then(data => {
                    this.logining = false;


                    if (!data.success) {
                        _this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    } else {

                        _this.$message({
                            message: "后台初始化成功",
                            type: 'success'
                        });

                        window.localStorage.NavigationBar = JSON.stringify(data.response)
                        _this.$router.replace(_this.$route.query.redirect ? _this.$route.query.redirect : "/");
                    }
                });
            }
        }
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
