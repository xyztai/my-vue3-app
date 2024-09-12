module.exports = {
  transpileDependencies: true,
  devServer: {
    port: 8085,
    open: true,
    proxy: {
      '/e': {
        target: 'http://142.171.151.123:51666', // 目标API地址
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务器，然后发送请求的数据，会同时会收到请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/e': '' // 路径重写，移除路径中的/e
        }
      }
    }
  }
}
