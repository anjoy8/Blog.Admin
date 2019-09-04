<template>
    <div style="margin-top: 30px;">
          <div style="margin: 20px;"> 欢迎来到 BlogAdmin 后台管理系统!</div>

<el-card style="width:30%;float:left;margin-right:10px;">
    <el-aside>快来加入我们吧：</el-aside>

    <br>
    <img style="width: 300px;" src="../assets/QQGroup.png" />
</el-card>
<el-card style="width:30%;float:left;margin-right:10px;">
    <el-aside>动态添加一个vue页面：</el-aside>

    <br>
    <img style="width: 300px;" src="http://apk.neters.club/images/addVuePages.gif" />
</el-card>
<el-card style="width:30%;float:left;">
    <el-aside>快速配置接口权限：</el-aside>

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
