const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../..'),
  srcDir: __dirname,
  serverMiddleware: ['@@/examples/api/auth'],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      }
    }
  },
  modules: ['@nuxtjs/axios', '@@'],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
