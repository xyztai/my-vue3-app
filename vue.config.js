module.exports = {
  devServer: {
    proxy: {
      '^/ag': {
        target: 'http://142.171.151.123:51666',
        ws: true,
        changeOrigin: true
      }
    },
    port: 8085,
    open: true
  }
}
