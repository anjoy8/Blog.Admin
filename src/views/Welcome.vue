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
    <el-aside>动态添加一个vue页面：</el-aside>

    <br>
    <img style="width: 300px;" src="http://apk.neters.club/images/addVuePages.gif" />
</el-card>
<el-card class="welcome-card">
    <el-aside>快速配置接口权限：</el-aside>

    <br>
    <div style="height: 300px;overflow-y: auto;">
        <el-steps direction="vertical">
            <el-step title="步骤 1" description="创建一个控制台controller"></el-step>
            <el-step title="步骤 2" description="修改接口地址，带上 action，编译"></el-step>
            <el-step title="步骤 3" description="因为我这里是全局的权限公约，所以新建的controller，不用配置权限，默认已经加上了权限"></el-step>
            <el-step title="步骤 4" description="测试 department 接口，是否已经被保护"></el-step>
            <el-step title="步骤 5.1" description="vueadmin 后台 配置权限：第一步：新建api接口"></el-step>
            <el-step title="步骤 5.2" description="第二步：添加一个菜单，可以是一个查询按钮，也可以是一个路由页面"></el-step>
            <el-step title="步骤 5.3" description="第三步：权限分配！勾选角色和刚刚的菜单"></el-step>
            <el-step title="步骤 6" description="netcore 停掉服务，或者等10+分钟以上，因为有缓存"></el-step>
            <el-step title="步骤 7" description="重启服务，访问接口，登录，查看是否有权限"></el-step>
        </el-steps>
    </div>


    <br>
    <br>
    <br>
    <img style="width: 300px;" src="http://apk.neters.club/images/addpermission.gif" />
</el-card>
    </div>
</template>

<script>
    import applicationUserManager from "../Auth/applicationusermanager";
  
  export default {
        name: "Welcome",
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
