<template>
    <div style="margin-top: 30px;">
          <div style="margin: 20px;"> 欢迎来到 BlogAdmin 后台管理系统!</div>

<el-card>
    <el-aside>快来加入我们吧：</el-aside>

    <br>
    <img style="width: 300px;" src="../assets/QQGroup.png" />
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
