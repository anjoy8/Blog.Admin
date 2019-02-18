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
                                        <el-menu-item class="title-name"  v-for="child in item.children" :index="item.path+'/'+child.path" :key="item.path+'/'+child.path" :base-path="item.path"
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
                    <el-col :span="24" class="content-wrapper">
                        <div class="tags" v-if="showTags">
                            <ul>
                                <li @click="gotappath(item.path)" class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
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
                            <router-view></router-view>
                        </transition>
                    </el-col>
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
                }
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
                } else {
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.tagsList = [];
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsList = curItem;
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
            }
        },
        mounted() {
            console.log(this.$route)

            var user = JSON.parse( window.localStorage.user);
            if (user) {
                this.sysUserName = user.uRealName || '老张的哲学';
                this.sysUserAvatar = user.avatar || '../assets/user.png';
            } else {
                this.sysUserName = '老张的哲学';
                this.sysUserAvatar = '../assets/user.png';
            }
            var tags =JSON.parse( sessionStorage.getItem('Tags'));
            if (tags.length>0) {
                this.tagsList = tags;
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
        cursor: pointer;
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
