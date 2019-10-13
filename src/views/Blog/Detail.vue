<template>
    <div>详情页,id 是 {{id}}</div>
</template>

<script>
    export default {
        name: "Detail",
        data() {
            return {
                id: this.$route.params.id,
            };
        },
        mounted(){
            console.log(this.$route)
        }
    }
</script>

<style scoped>

</style>
