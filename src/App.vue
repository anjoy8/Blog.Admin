<template>
    <div id="app">
        <transition v-if="!$route.meta.NoNeedHome" name="fade"
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

                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item  v-for="item in $route.matched" :key="item.path">

                               <span style=""> {{ item.name }}</span>
                            </el-breadcrumb-item>
                        </el-breadcrumb>

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
                        <el-scrollbar style="height:100%;background: #2f3e52;">
                        <el-menu  :default-active="$route.path"
                                 class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
                                 unique-opened router :collapse="isCollapse"
                                 background-color="#2f3e52"
                                 text-color="#fff"
                                 active-text-color="#ffd04b">
                            <sidebar v-for="(menu,index) in routes" :key="index" :item="menu" />
                        </el-menu>


                        </el-scrollbar>
                    </aside>

                    <el-col :span="24" class="content-wrapper" :class="collapsed?'content-collapsed':'content-expanded'">
                        <div class="tags" v-if="showTags">
                            <ul>
                                <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                                    <span class="tag-dot-inner"></span>
                                    <router-link :to="item.path" class="tags-li-title">
                                        {{item.title}}
                                    </router-link>
                                    <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
                                </li>
                            </ul>
                            <!-- 其他操作按钮 -->
                            <div class="tags-close-box">
                                <el-dropdown @command="handleTags">
                                    <el-button size="mini">
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu size="small" slot="dropdown">
                                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                        <transition name="fade" mode="out-in">
                            <div class="content-az">
                                <router-view></router-view>
                            </div>
                        </transition>
                    </el-col>

                </el-col>
            </el-row>

        </transition>

        <transition v-else name="fade" mode="out-in">
            <div class="content-az">
                <router-view></router-view>
            </div>
        </transition>
    </div>
</template>
<script>
    import Sidebar from './components/Sidebar'
    import {getUserByToken} from './api/api';
    export default {
        components: { Sidebar },
        data() {
            return {
                sysName: 'BlogAdmin',
                sysNameShort: 'BA',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                isCollapse: false,
                tagsList: [],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                routes:[]
                ,
            }
        },
        methods: {
            gotappath(Path) {
                console.log(Path);
                this.$router.replace({
                    path: Path,
                });
            },
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
                    window.localStorage.removeItem('user');
                    window.localStorage.removeItem('Token');
                    window.localStorage.removeItem('TokenExpire');
                    window.localStorage.removeItem('NavigationBar');
                    window.localStorage.removeItem('refreshtime');
                    window.localStorage.removeItem('router');
                    sessionStorage.removeItem("Tags");

                    global.antRouter = [];

                    this.tagsList = [];
                    this.routes = [];
                    this.$store.commit("saveTagsData","");
                    _this.$router.push('/login');
                    window.location.reload()
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
            },
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {

                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);

                    this.$store.commit("saveTagsData",JSON.stringify(this.tagsList));
                } else {
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.tagsList = [];
                this.$router.push('/');
                sessionStorage.removeItem("Tags");
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsList = curItem;


                sessionStorage.setItem("Tags",JSON.stringify(this.tagsList))
            },
            // 设置标签
            setTags(route) {
                if(!route.meta.NoTabPage) {
                    const isExist = this.tagsList.some(item => {
                        return item.path === route.fullPath;
                    })
                    !isExist && this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        // name: route.matched[1].components.default.name
                    })
                }
            },
            // 当关闭所有页面时隐藏
            handleTags(command) {
                command === 'other' ? this.closeOther() : this.closeAll();
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

                        _this.sysUserName = data.response.uRealName ;
                        window.localStorage.user=JSON.stringify(data.response)
                    }
                });
            }
        },
        mounted() {
            console.log(this.$route)

            var tags =sessionStorage.getItem('Tags') ?  JSON.parse( sessionStorage.getItem('Tags')):[];

            if (tags&&tags.length>0) {
                this.tagsList = tags;
            }


            var NavigationBar = JSON.parse(window.localStorage.router? window.localStorage.router:null);
            // var NavigationBar = global.antRouter;

            if (this.routes.length<=0&&NavigationBar&&NavigationBar.length>=0) {
                this.routes=NavigationBar;
            }

        },
        updated(){

            var user = JSON.parse(window.localStorage.user? window.localStorage.user:null);
            if (user) {
                this.sysUserName = user.uRealName || '老张的哲学';
                this.sysUserAvatar = user.avatar || '../assets/user.png';
            }


            var NavigationBar = JSON.parse(window.localStorage.router? window.localStorage.router:null);

            if (NavigationBar&&NavigationBar.length>=0) {
                if (this.routes.length<=0||(JSON.stringify(this.routes)!=JSON.stringify((NavigationBar)))) {
                this.routes=NavigationBar;
                }
            }

        },
        computed: {
            showTags() {

                if (this.tagsList.length>1) {
                    this.$store.commit("saveTagsData",JSON.stringify(this.tagsList));
                }

                return this.tagsList.length > 0;
            }
        },
        watch: {
            // 对router进行监听，每当访问router时，对tags的进行修改
            $route(newValue) {
                this.setTags(newValue);
            }
        },
        created() {
            // 第一次进入页面时，修改tag的值
            this.setTags(this.$route);
        },
    }

</script>

<style lang="css">
    @import "./style/home.css";

    .el-menu-vertical-demo {
        /*width: 230px;*/
    }

    .el-breadcrumb{
        line-height: 60px !important;
    }
</style>

<style>
    .tags {
        position: relative;
        overflow: hidden;
        border: 1px solid #f0f0f0;
        margin-bottom: 20px;
        background: #f0f0f0;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding:0;
        margin: 0;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 13px;
        overflow: hidden;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 3px 5px 4px 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }
    .tags-li-icon{
        cursor: pointer;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
        text-decoration: none;
    }

    .tags-li.active {
        /*color: #fff;*/
        /*border: 1px solid #10B9D3;*/
        /*background-color: #10B9D3;*/
    }

    .tags-li.active .tags-li-title {
        /*color: #fff;*/
    }

    .tags-close-box {
        box-sizing: border-box;
        text-align: center;
        z-index: 10;
        float: right;
        margin-right: 1px;
        line-height: 2;
    }

</style>
