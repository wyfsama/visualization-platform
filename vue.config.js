module.exports = {
  devServer: {
    port: 5500, // 端口2222
    open: true // 自动打开浏览器
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/visualization-platform/dist'
    : '/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'visualization-platform_在线大屏可视化'
        return args
      })
  }
}
