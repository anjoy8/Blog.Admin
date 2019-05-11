<template>
    <div>详情页,id 是 {{id}}</div>
</template>

<script>
    export default {
        name: "Detail",
        data() {
            return {
                id: this.$route.query.id,
            };
        }
    }
</script>

<style scoped>

</style>
