<template>
    <div style="margin-top: 30px;">
          <div style="margin: 20px;"> 欢迎来到 BlogAdmin 后台管理系统!</div>

<el-card shadow="hover" class="welcome-card note">
   <div slot="header" class="clearfix">
    <span>操作指南</span>
  </div>
  <div class="text item"><i class="el-icon-edit"></i>、在vue.config.js中配置项目端口号，以及代理后端API项目域名。  </div>
  <div class="text item"><i class="el-icon-edit"></i>、在global.js中配置授权方案global.IS_IDS4。  </div>
  <div class="text item"><i class="el-icon-edit"></i>、动态添加页面以及权限配置，看右侧两个动图。  </div>
  <div class="text item"><i class="el-icon-edit"></i>、更多内容，查看官方文档：<a href="http://vueadmin.neters.club/.doc/" target="_blank">http://vueadmin.neters.club/.doc/</a>。  </div>
</el-card>
<el-card class="welcome-card">
   <div slot="header" class="clearfix">
    <span>服务器：</span>
   </div>

    <br>
  <div class="text item">环境变量：{{serverInfo.EnvironmentName}}</div>
  <div class="text item">系统架构：{{serverInfo.OSArchitecture}}</div>
  <div class="text item">ContentRootPath：{{serverInfo.ContentRootPath}}</div>
  <div class="text item">WebRootPath：{{serverInfo.WebRootPath}}</div>
  <div class="text item">.NET Core版本：{{serverInfo.FrameworkDescription}}</div>
  <div class="text item">内存占用：{{serverInfo.MemoryFootprint}}</div>
  <div class="text item">启动时间：{{serverInfo.WorkingTime}}</div>
    

    
</el-card>
<el-card class="welcome-card">
    <div slot="header" class="clearfix">
        <span>相关配置</span>
    </div>


    <el-aside>1、动态添加一个vue页面：</el-aside>

    <br>
    
    <div class="text item"><i class="el-icon-edit"></i>、更多内容，查看博客园文档：<a href="https://www.cnblogs.com/laozhang-is-phi/p/10643993.html#autoid-2-6-0" target="_blank">https://www.cnblogs.com/laozhang-is-phi/p/10643993.html#autoid-2-6-0</a>。  </div>

    <br>
    <hr>
    <br>

    <el-aside>2、快速配置接口权限：</el-aside>

    <br>
    <div style="height: 300px;overflow-y: auto;">
        <el-steps direction="vertical">
            <el-step title="步骤 1" description="创建一个测试控制器 DemoController"></el-step>
            <el-step title="步骤 2" description="修改接口路由地址，带上 [action] ，比如，/api/[controller]/[action]，编译是否正常"></el-step>
            <el-step title="步骤 3" description="给需要加权限的路由api上，增加授权特性[[Authorize(Permissions.Name)]]"></el-step>
            <el-step title="步骤 4" description="测试 /api/demo/get 接口，是否已经被保护"></el-step>
            <el-step title="步骤 5.1" description="vueadmin 后台 配置权限：第一步：登录后台，新建api接口"></el-step>
            <el-step title="步骤 5.2" description="第二步：添加一个菜单，可以是一个查询按钮，也可以是一个路由页面"></el-step>
            <el-step title="步骤 5.3" description="第三步：权限分配！勾选角色和刚刚的菜单"></el-step>
            <el-step title="步骤 6" description="如果后端netcore资源服务器有缓存，记得清理"></el-step>
            <el-step title="步骤 7" description="重新登录Admin管理后台，访问接口，查看是否有权限"></el-step>
        </el-steps>
    </div>


    <br>
</el-card>
    </div>
</template>

<script>
    import applicationUserManager from "../Auth/applicationusermanager";
    import {getServerInfo} from '../api/api';
  
  export default {
        name: "Welcome",
         data() {
            return {
                serverInfo:{}
            }
        },
        mounted() {
            var curTime = new Date()
            if(window.localStorage.TokenExpire){
                var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))
                if(curTime>=expiretime){
                    if (global.IS_IDS4) {
                        applicationUserManager.login();
                    } else {
                        this.$router.push('/login');
                    }
                }
            }else {
                if (global.IS_IDS4) {
                    applicationUserManager.login();
                } else {
                    this.$router.push('/login');
                }
            }

            getServerInfo({}).then((res) => {
                this.serverInfo = res.data.response;
            });

        },
    }
</script>

<style scoped>
.note .text {
    font-size: 14px;
  }

 .note .item {
    margin-bottom: 18px;
  }
</style>
