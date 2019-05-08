// 生产环境导入组件
// NGINX 发布模式
module.exports = file => () => import('@/views' + file + '.vue')

// IIS 发布模式下，使用下边这个方法
// export default  file => () => import('@/views' + file + '.vue')
