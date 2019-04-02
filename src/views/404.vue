<template>
    <div>
        <p class="page-container">没有找到你要的页面<br>你是不是迷路了?


            <router-link to="/">点击返回首页 </router-link>
        </p>
    </div>
</template>

<style >
    .page-container {
        font-size: 25px;
        text-align: center;
        color: rgb(192, 204, 218);
    }

    .router-link-active{
        font-size: 14px;
    }
</style>
