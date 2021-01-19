// 生产环境导入组件
try {
    module.exports = file => () => import('@/views' + file + '.vue')
} catch (error) {
    // IIS 发布模式下，使用下边这个方法
    // export default  file => () => import('@/views' + file + '.vue')

    console.info('%c 如果使用 IIS 部署，请\n 1：修改api.js的base为绝对路径 \n 2：在根目录创建web.config文件，内容查看https://router.vuejs.org/zh/guide/essentials/history-mode.html \n 3：配置CORS跨域 \n ', "color:blue")
}

// web.config ，主要解决IIS 部署，刷新 404 问题，官方文章地址：https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
// <?xml version="1.0" encoding="UTF-8"?>
// <configuration>
//   <system.webServer>
//     <rewrite>
//       <rules>
//         <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
//           <match url="(.*)" />
//           <conditions logicalGrouping="MatchAll">
//             <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
//             <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
//           </conditions>
//           <action type="Rewrite" url="/" />
//         </rule>
//       </rules>
//     </rewrite>
//   </system.webServer>
// </configuration>
