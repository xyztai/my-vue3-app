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
  },

  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
