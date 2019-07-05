<template>
    <div>我是测试的第一个页面. name is {{ msg }}</div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "TestOne",
        data(){
            return{
                msg:''
            }
        },
        mounted(){
            let that=this;
            axios.post('/api/Values/TestPostPara?name=anson zhang', {})
                .then(res => {
                    that.msg=res.data.name
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }
</script>

<style scoped>

</style>
