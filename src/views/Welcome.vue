<template>
    <div style="margin-top: 30px;">
          <div style="margin: 20px;"> 欢迎来到 BlogAdmin 后台管理系统!</div>

<el-card class="welcome-card">
    <el-aside>快来加入我们吧：</el-aside>

    <br>
    <img style="width: 300px;" src="../assets/QQGroup.png" />
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
    export default {
        name: "Welcome",
        mounted() {
            var curTime = new Date()
            if(window.localStorage.TokenExpire){
                var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))
                if(curTime>=expiretime){
                    this.$router.push('/login');
                }
            }else {
                this.$router.push('/login');
            }

        },
    }
</script>

<style scoped>

</style>
