
<img src="https://github.com/anjoy8/Blog.Admin/blob/master/src/assets/logoall.png" width="350"  />

      
      
      
一个基于 Vue.js 的后台管理系统项目，目前是1.0版本，主要是权限管理系统，以后会增加更多功能，持续开发中...。




## 给个星星! ⭐️
如果你喜欢这个项目或者它帮助你, 请给 Star~（辛苦星咯）


## Tips：
```

1【重要】、下载后，install 安装依赖，然后 npm run serve 运行，
想要成功，记得要启动后端api接口服务，也就是blog.core 项目，我配置的是端口，8081(api后端)、2364(本项目)，


devServer: {
    open: true, //配置自动启动浏览器
    host: "127.0.0.1",
    port: 2364, // 当前vue项目 端口号
    https: false,
    hotOnly: false, // https:{type:Boolean}
    // proxy: null, // 设置代理
    // proxy: 'http://123.206.33.109:8081',          // 配置跨域处理,只有一个代理
    proxy: {
      // 配置多个代理
      "/api": {
        target: "http://localhost:8081",//这里改成你自己的后端api端口地址，记得每次修改，都需要重新build
        //target: "http://localhost:58427",
        //target: "http://api.douban.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          // 路径重写，
          "^/apb": "" // 替换target中的请求地址
        }
      }
    },
    before: app => {}
  },



```

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








