<template>
    <div id="app">
        <transition v-if="!$route.meta.NoNeedHome" name="fade"
                    mode="out-in">

            <el-row class="container">
                <el-col :span="24" class="header">
                    <el-col :span="10" class="logo collapsedLogo" :class="collapsed?'logo-collapse-width':'logo-width'">
                        <div @click="toindex"> {{collapsed?sysNameShort:sysName}}</div>
                    </el-col>
                    <el-col :span="10" class="logoban">
                        <div :class=" collapsed?'tools collapsed':'tools'" @click="collapse">
                            <i class="fa fa-align-justify"></i>
                        </div>

                        <el-breadcrumb separator="/" class="breadcrumb-inner collapsedLogo">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">

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
                                <el-dropdown-item @click.native="myNews">
                                    <el-badge :value="2" class="item" type="warning">
                                        我的消息
                                    </el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="Setting">设置</el-dropdown-item>
                                <el-dropdown-item @click.native="goGithub">Github</el-dropdown-item>
                                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-col>
                <el-col :span="24" class="main">


                    <aside :class="collapsedClass ">
                        <el-scrollbar style="height:100%;background: #2f3e52;"  class="scrollbar-handle">
                            <el-menu 
                                     
                                    :default-active="$route.path"
                                     class="el-menu-vertical-demo" @open="handleopen" @close="handleclose"
                                     @select="handleselect"
                                     unique-opened router :collapse="collapsed"
                                     background-color="#2f3e52"
                                     style="border-right: none;"
                                     text-color="#fff"
                                     active-text-color="#ffd04b">
                                <sidebar v-for="(menu,index) in routes" :key="index"
                                         :item="menu"/>
                            </el-menu>


                        </el-scrollbar>
                    </aside>

                    <el-col :span="24" class="content-wrapper"
                            :class="collapsed?'content-collapsed':'content-expanded'">
                        <div class="tags" v-if="showTags">

                            <div id="tags-view-container" class="tags-view-container">
                                <scroll-pane ref="scrollPane" class="tags-view-wrapper">
                                    <router-link
                                            v-for="(tag,index) in tagsList"
                                            ref="tag"
                                            :key="tag.path"
                                            :class="{'active': isActive(tag.path)}"
                                            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                                            tag="span"
                                            @click.middle.native="closeTags(index)"
                                            class="tags-view-item"
                                    >
                                        {{ tag.title }}
                                        <span class="el-icon-close" @click.prevent.stop="closeTags(index)"/>
                                    </router-link>
                                </scroll-pane>

                            </div>

                            <!--<ul>-->
                            <!--<li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">-->
                            <!--<span class="tag-dot-inner"></span>-->
                            <!--<router-link :to="item.path" class="tags-li-title">-->
                            <!--{{item.title}}-->
                            <!--</router-link>-->
                            <!--<span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>-->
                            <!--</li>-->
                            <!--</ul>-->

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
                            <div class="content-az router-view-withly">
                                <!-- 含有母版的路由页面 -->
                                <router-view></router-view>
                            </div>
                        </transition>
                    </el-col>

                </el-col>
            </el-row>

        </transition>

        <transition v-else name="fade" mode="out-in">

            <div  >
                <router-view></router-view>
            </div>
        </transition>

        <el-dialog title="Unread Messages" :class="newsDialogCss" :visible.sync="NewsVisible" v-model="NewsVisible"
                   :close-on-click-modal="false">
            <div>
                <el-tag
                        v-for="tag in tagNews"
                        :key="tag.name"
                        closable
                        class="tag-new"
                        :type="tag.type">
                    {{tag.name}}
                </el-tag>

            </div>
        </el-dialog> 
       
        <div class="v-modal " @click="collapse" v-show="SidebarVisible" tabindex="0" style="z-index: 2999;"></div>
    </div>
</template>
<script>
    import Sidebar from './components/Sidebar'
    import ScrollPane from './components/ScrollPane'
    import {getUserByToken} from './api/api';

    import applicationUserManager from "./Auth/applicationusermanager";
    import userAuth from "./Auth/UserAuth";

    export default {
        components: {Sidebar, ScrollPane},
        mixins: [userAuth],
        data() {
            return {
                sysName: 'BlogAdmin',
                sysNameShort: 'BD',
                NewsVisible: false,
                collapsed: false,
                zModalShadow: false,
                SidebarVisible: false,
                collapsedClass: 'menu-expanded',
                sysUserName: '',
                newsDialogCss: 'news-dialog',
                sysUserAvatar: '',
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
                routes: [],
                tagNews: [
                    {name: '前后端分离', type: ''},
                    {name: 'vue.js', type: ''},
                    {name: 'DDD领域驱动设计', type: 'success'},
                    {name: '标签三', type: 'info'},
                    {name: '欠费警告！', type: 'warning'},
                    {name: '异常报告！', type: 'danger'}
                ],
                visible: false,
                top: 0,
                left: 0,
                selectedTag: {},
                affixTags: []

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
            myNews() {

                this.newsDialogCss += ' show ';
                this.NewsVisible = true;
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
                    this.$store.commit("saveTagsData", "");

                    if (global.IS_IDS4) {
                        applicationUserManager.logout();
                    } else {
                        _this.$router.push('/login');
                        //window.location.reload()
                    }
                    
                }).catch(() => {

                });


            },
            //设置
            Setting: function () {
                var _this = this;
                _this.$router.push('/System/My');
            },
            //源码
            goGithub() {
                window.open("https://github.com/anjoy8/Blog.Admin")
            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;

                if (this.collapsed) {
                    this.collapsedClass = 'menu-collapsed';
                    this.SidebarVisible = false;
                } else {
                    this.collapsedClass = 'menu-expanded';
                    if(window.screen.width < 680){
                        this.SidebarVisible = true;
                    }
                }
                //记录折叠状态
                window.localStorage.collapse = this.collapsed;
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

                    this.$store.commit("saveTagsData", JSON.stringify(this.tagsList));
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


                sessionStorage.setItem("Tags", JSON.stringify(this.tagsList))
            },
            // 设置标签
            setTags(route) {
                if (!route.meta.NoTabPage) {
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

                        _this.sysUserName = data.response.uRealName;
                        window.localStorage.user = JSON.stringify(data.response)
                    }
                });
            },
        },
        mounted() {
            console.log(this.$route)

            var tags = sessionStorage.getItem('Tags') ? JSON.parse(sessionStorage.getItem('Tags')) : [];

            if (tags && tags.length > 0) {
                this.tagsList = tags;
            }
            

            var NavigationBar = JSON.parse(window.localStorage.router ? window.localStorage.router : null);
            // var NavigationBar = global.antRouter;

            if (this.routes.length <= 0 && NavigationBar && NavigationBar.length >= 0) {
                this.routes = NavigationBar;
            }

            // 折叠菜单栏
            
            
        },
        updated() {
            var user = JSON.parse(window.localStorage.user ? window.localStorage.user : null);
            if (user) {
                this.sysUserName = user.uRealName || '老张的哲学';
                this.sysUserAvatar = user.avatar || '../assets/user.png';
            }


            var NavigationBar = JSON.parse(window.localStorage.router ? window.localStorage.router : null);

            if (NavigationBar && NavigationBar.length >= 0) {
                if (this.routes.length <= 0 || (JSON.stringify(this.routes) != JSON.stringify((NavigationBar)))) {
                    this.routes = NavigationBar;
                }
            }

        },
        computed: {
            showTags() {
                if (this.tagsList.length > 1) {
                    this.$store.commit("saveTagsData", JSON.stringify(this.tagsList));
                }
                return this.tagsList.length > 0;
            }
        },
        watch: {
            // 对router进行监听，每当访问router时，对tags的进行修改
            $route: async function(newValue, from) {
                
                if (global.IS_IDS4) {
                    await this.refreshUserInfo();
                }

                this.setTags(newValue);

                const tags = this.$refs.tag
                this.$nextTick(() => {
                    if (tags) {
                        for (const tag of tags) {
                            if (tag.to.path === this.$route.path) {
                                this.$refs.scrollPane.moveToTarget(tag, tags)
                                // when query is different then update
                                // if (tag.to.fullPath !== this.$route.fullPath) {
                                //     this.$store.dispatch('tagsView/updateVisitedView', this.$route)
                                // }
                                break
                            }
                        }
                    }
                })

            },
            
        },
        created() {
            // 第一次进入页面时，修改tag的值
            this.setTags(this.$route);
            //读取折叠状态
            if(window.localStorage.collapse == 'true'){
                this.collapsed = false;
                this.collapse();
            }else{
                this.collapsed = true;
                this.collapse();
            }
        },
    }

</script>

<style lang="css">
    @import "./style/home.css";

    .el-menu-vertical-demo {
        /*width: 230px;*/
    }

    .el-breadcrumb {
        line-height: 60px !important;
    }
</style>

<style>
    .menu-collapsed .el-icon-arrow-right:before {
        display: none;
    }

    .tags {
        position: relative;
        overflow: hidden;
        border: 1px solid #f0f0f0;
        background: #f0f0f0;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        display: none;
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

    .tags-li-icon {
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
<style>
    /*.logoban{*/
    /*width: auto !important;*/
    /*}*/
    .news-dialog {

        background: #fff;
        z-index: 3000 !important;
        position: fixed;
        height: 100vh;
        width: 100%;
        max-width: 260px;
        top: 60px !important;
        left: 0 !important;;
        -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
        box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
        -webkit-transition: all .25s cubic-bezier(.7, .3, .1, 1);
        transition: all .25s cubic-bezier(.7, .3, .1, 1);
        -webkit-transform: translate(100%);
        z-index: 40000;
        left: auto !important;;
        right: 0 !important;;
        transform: translate(0);
    }

    .news-dialog .el-dialog {
        margin: auto !important;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-shadow: none;
        width: 100%;
    }

    .news-dialog.show {
        transform: translate(0);
    }

    .tag-new {
        width: 100%;
        margin: 10px 0;
    }

    @media screen and (max-width: 680px) {

        .collapsedLogo {
            display: none;
        }

        .el-dialog {
            width: 90% !important;
        }

        .content-expanded {
            max-width: 100% !important;
            width: 100% !important;
            /* max-height: calc(100% - 60px); */
        }
        .content-collapsed{
            max-width: 100% !important;
            width: 100% !important;
        }
        .menu-collapsed{
            display: none;
        }
        .menu-expanded{
            position: fixed;
            z-index: 3000;
            height: 100vh !important;
            width: 210px !important;
            overflow-y:scroll !important;
            overflow-x:scroll !important;
        }
        .scrollbar-handle{
            margin-bottom: 60px;
        }
        .mobile-ex {
            background: #fff;
            z-index: 3000;
            position: fixed;
            height: 100vh;
            width: 100%;
            max-width: 260px;
            top: 0;
            left: 0;
            -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
            box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
            -webkit-transition: all .25s cubic-bezier(.7, .3, .1, 1);
            transition: all .25s cubic-bezier(.7, .3, .1, 1);
            -webkit-transform: translate(100%);
            z-index: 40000;
            left: auto;
            right: 0;
            transform: translate(100%);
        }

        .mobile-ex.menu-collapsed-mobile {
            transform: translate(0);
        }

        .el-menu--collapse {
            width: 100% !important;
        }

        .el-date-editor.el-input, .el-date-editor.el-input__inner, .el-cascader.el-cascader--medium {
            width: 100% !important;
        }

        .toolbar.roles {
            width: 100% !important;
        }

        .toolbar.perms {
            width: 800px !important;
        }

        .toolbar.perms .box-card {
            width: 100% !important;
        }

        .login-container {
            width: 300px !important;
        }

        .count-test label {

        }

        .content-wrapper .tags {
            margin: 0px;
            padding: 0px;
        }

        .activeuser{
            display: none !important;
        }

    }
</style>

<style>

    .tags-view-container {
        height: 34px;
        width: calc(100% - 60px);
        /*background: #fff;*/
        /*border-bottom: 1px solid #d8dce5;*/
        /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);*/
        float: left;
    }

    .tags-view-container .tags-view-wrapper .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
    }

    .tags-view-container .tags-view-wrapper .tags-view-item:first-of-type {
        margin-left: 15px;
    }

    .tags-view-container .tags-view-wrapper .tags-view-item:last-of-type {
        margin-right: 15px;
    }

    .tags-view-container .tags-view-wrapper .tags-view-item.active {
        /*background-color: #42b983;*/
        /*color: #fff;*/
        /*border-color: #42b983;*/
    }

    .tags-view-container .tags-view-wrapper .tags-view-item.active::before {
        content: "";
        background: #2d8cf0;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
    }

    .tags-view-container .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .tags-view-container .contextmenu li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
    }

    .tags-view-container .contextmenu li:hover {
        background: #eee;
    }
</style>

<style>
    .tags-view-wrapper .tags-view-item .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
    }

    .tags-view-wrapper .tags-view-item .el-icon-close:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
    }

    .tags-view-wrapper .tags-view-item .el-icon-close:hover {
        background-color: #ef2b74;
        color: #fff;
    }
</style>
