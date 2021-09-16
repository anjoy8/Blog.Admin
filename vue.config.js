module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {},
  configureWebpack: () => {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true, //配置自动启动浏览器
    host: "127.0.0.1",
    port: 2364, // 当前vue项目 端口号
    https: false,
    hotOnly: false, // https:{type:Boolean}
    // proxy: null, // 设置代理
    // proxy: 'http://123.206.33.109:9291',          // 配置跨域处理,只有一个代理
    proxy: {
      // 配置多个代理
      "/api": {
        target: "http://localhost:9291",//这里改成你自己的后端api端口地址，记得每次修改，都需要重新build
        //target: "http://localhost:58427",
        //target: "http://api.douban.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          // 路径重写，
          "^/apb": "" // 替换target中的请求地址
        }
      },
      "/images": {
        target: "http://localhost:9291",
        ws: true,
        changeOrigin: true
      },
      "/is4api": {
        target: "http://localhost:5004",
        ws: true,
        changeOrigin: true
      },
    },
    before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
