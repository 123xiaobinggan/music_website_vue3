const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 添加开发服务器配置
  devServer: {
    // 配置代理解决跨域问题
    proxy: {
      '/api': {
        target: 'http://120.48.156.237:1000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})