# 快速上手
注意

请确保你的 Node.js 版本 >= 8（`node -v`）。  
vue 脚手架版本 >= 3.1（`vue -V`）


## 下载

Github（国际） 下载 [https://github.com/anjoy8/Blog.Admin](https://github.com/anjoy8/Blog.Admin)    
    
Gitee（国内） 下载 [https://gitee.com/laozhangIsPhi/Blog.Admin](https://gitee.com/laozhangIsPhi/Blog.Admin)  

## 安装
下载完成后，在根目录下，执行 `npm i` 安装依赖包。  
也可以使用 `yarm` 或者淘宝镜像 `cnpm`；  
安装完成后，根目录会多一个 `node_modules` 文件夹；  

## 运行
安装好后，执行 `npm run serve` 运行项目；  
这个时候会调起 `2364` 端口，浏览器查看效果；


## 端口配置
如果你不想要这个端口，可以在项目根目录的 `vue.config.js` 中的 `devServer` 节点下的 `port`，把端口号修改为自己任意需要的；  


## 配置后端api
项目启动后，想要查看效果，就必须开启后端 `api` 项目；  
相应的后端官方文档：[http://apk.neters.club/.doc/guide/getting-started.html](http://apk.neters.club/.doc/guide/getting-started.html)   ；


## 修改后端api的端口号
如果你的后端项目启动后，端口号不是 `8081` 的话，需要在本项目配置：  
还是 `vue.config.js` 文件中的，`proxy` 节点下的 `http://localhost:8081` ,修改为自己后端的端口。

## 部署与发布

开发完成后，执行 `npm run build` ，将项目打包，  
根目录会出现一个 `dist` 文件夹，  
然后拷贝到服务器，用  `Nginx` 或者 `IIS` 进行代理即可。


