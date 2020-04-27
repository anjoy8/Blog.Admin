<template>
  <el-scrollbar style="height:100%" class="scrollbar-handle">    
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </el-scrollbar>
</template>





