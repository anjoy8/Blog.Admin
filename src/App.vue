<template>
    <div id="app">
        <transition v-if="!$route.meta.requireHome" name="fade"
                    mode="out-in">

            <el-row class="container">

                <el-col :span="24" class="header">
                    <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                      <div @click="toindex" >  {{collapsed?sysNameShort:sysName}}</div>
                    </el-col>
                    <el-col :span="10">
                        <div :class=" collapsed?'tools collapsed':'tools'" @click="collapse">
                            <i class="fa fa-align-justify"></i>
                        </div>



                    </el-col>
                    <el-col :span="4" class="userinfo">
                        <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">
                        {{sysUserName}}
                        <img src="./assets/logo.png" height="128" width="128"/>
                    </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>我的消息</el-dropdown-item>
                                <el-dropdown-item>设置</el-dropdown-item>
                                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-col>
                <el-col :span="24" class="main">
                    <aside :class="collapsed?'menu-collapsed':'menu-expanded'">

                        <el-menu  :default-active="$route.path"
                                 class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
                                 unique-opened router :collapse="isCollapse"
                                 background-color="#2f3e52"
                                 text-color="#fff"
                                 active-text-color="#ffd04b">
                            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">

                                <template v-if="item.children">


                                    <el-submenu :index="index+''" v-if="!item.leaf">
                                        <template slot="title">
                                            <i :class="item.iconCls"></i>
                                            <span class="title-name" slot="title">{{item.name}}</span>
                                        </template>
                                        <el-menu-item class="title-name"  v-for="child in item.children" :index="child.path" :key="child.path"
                                                      v-if="!child.hidden">{{child.name}}
                                        </el-menu-item>
                                    </el-submenu>
                                    <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i
                                            :class="item.iconCls"></i>{{item.children[0].name}}
                                    </el-menu-item>
                                </template>
                                <template v-else>

                                    <el-menu-item :index="item.path">
                                        <i :class="item.iconCls"></i>
                                        <template slot="title">
                                            <span class="title-name" slot="title">{{item.name}}</span>
                                        </template>

                                    </el-menu-item>

                                </template>
                            </template>

                        </el-menu>


                    </aside>
                    <section class="content-container">
                        <div class="grid-content bg-purple-light">
                            <el-col :span="24" class="breadcrumb-container">
                                <strong class="title">{{$route.name}}</strong>
                                <el-breadcrumb separator="/" class="breadcrumb-inner">
                                    <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                        {{ item.name }}
                                    </el-breadcrumb-item>
                                </el-breadcrumb>
                            </el-col>
                            <el-col :span="24" class="content-wrapper">
                                <transition name="fade" mode="out-in">
                                    <router-view></router-view>
                                </transition>
                            </el-col>
                        </div>
                    </section>
                </el-col>
            </el-row>

        </transition>

        <transition v-else name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                sysName: 'BlogAdmin',
                sysNameShort: 'BA',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                isCollapse: false,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            toindex() {
                this.$router.replace({
                    path: "/",
                });
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    _this.$router.push('/login');
                }).catch(() => {

                });


            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
                this.isCollapse = !this.isCollapse;

            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            console.log(this.$route)
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || '老张的哲学';
                this.sysUserAvatar = user.avatar || '../assets/user.png';
            } else {
                this.sysUserName = '老张的哲学';
                this.sysUserAvatar = '../assets/user.png';
            }

        }
    }

</script>

<style lang="css">
    @import "./style/home.css";

    .el-menu-vertical-demo {
        /*width: 230px;*/
    }
</style>

