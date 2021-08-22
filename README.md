
<img src="https://github.com/anjoy8/Blog.Admin/blob/master/src/assets/logoall.png" width="350"  />

      
      
      
一个基于 Vue.js 的后台管理系统项目，目前是1.0版本，主要是权限管理系统，以后会增加更多功能，持续开发中...。


这里仅仅是vue项目，api接口工程，请查看 [Blog.Core](https://github.com/anjoy8/Blog.Core)




## 给个星星! ⭐️
如果你喜欢这个项目或者它帮助你, 请给 Star~（辛苦星咯）

*********************************************************
### 项目下载后，首先安装依赖包
```
npm install
```

### 安装成功后，运行即可
```
npm run serve // 请不要把 再一直用 dev 命令了
```
然后你就可以直接访问 http://localhost:6688


## Tips：



```
如果你想换一个端口，可以直接修改根目录下的 vue.config.js 文件

  devServer: {
    port: 2364, // 当前 admin 项目的端口号
    https: false,

而且也要代理下后端的接口地址，如果你使用 proxy 来实现跨域的话（如果用 CORS 跨域，这里就不用配置了）：

    proxy: {
      // 配置多个代理
      "/api": {
        target: "http://localhost:8081",//这里改成你自己的后端api端口地址，记得每次修改，都需要重新build

```

### 如果要部署，先执行bulid
```
npm run build
```




## 售后服务与支持  

鼓励作者，简单打赏，入微信群，随时随地解答我框架中（NetCore、Vue、DDD、IdentityServer4等）的疑难杂症。     
注意主要是帮忙解决bug和思路，不会远程授课，但是可以适当发我代码，我帮忙调试，       
打赏的时候，备注自己的微信号，我拉你进群，两天内没回应，QQ私聊我（3143422472）；   

[赞赏列表](http://apk.neters.club/.doc/Contribution/)  

 
<img src="http://apk.neters.club/laozhangisphigood.jpg" alt="赞赏码" width="300" >
[图片若加载不出来，点这里](http://apk.neters.club/laozhangisphigood.jpg)


*****************************************************
### 三大平台同步直播

博客园：https://www.cnblogs.com/laozhang-is-phi/p/10236645.html

简  书：https://www.jianshu.com/notebooks/28621653

 CSDN：https://blog.csdn.net/baidu_35726140


<div class="allindex">
<h1 id="allindex">目录</h1>



<ul>
<li><a id="post_title_link_10438122" href="https://www.cnblogs.com/laozhang-is-phi/p/10438122.html">一 || 权限后台1.0正式上线</a></li>
<li><a id="post_title_link_10462316" href="https://www.cnblogs.com/laozhang-is-phi/p/10462316.html">二 || 完美实现 JWT 滑动授权刷新</a></li>
<li><a id="post_title_link_10643993" href="https://www.cnblogs.com/laozhang-is-phi/p/10643993.html">三 || 动态路由配置 &amp; 项目快速开发</a></li>
<li><a id="post_title_link_10785022" href="https://www.cnblogs.com/laozhang-is-phi/p/netcore-vue-signalr.html">四 || NetCore + SignalR 实现日志消息推送</a></li>
      <li><a class="entry" href="https://www.cnblogs.com/laozhang-is-phi/p/11614437.html" target="_blank">五 ║ 实现『按钮』级别权限配置</a></li>
</ul>


</ul>


</div>
******************************

## 安装

```
 git clone https://github.com/anjoy8/Blog.Admin.git
```
安装包依赖
```
npm install
```

## 运行
运行开发环境
```js
npm run serve
```

**本地访问http://localhost:2364**
```
可以在根目录的 vue.config.js 中修改端口：

  "devServer": {
     "host": "127.0.0.1",
     "port": "2364"//端口号
  },
  
  
```


## 编译
build for production and launch server
```js
npm run build
```








