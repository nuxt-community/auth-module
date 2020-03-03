const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  serverMiddleware: ['@@/examples/api/auth'],
  auth: {
    plugins: [
      '~/plugins/auth.js'
    ],
    strategies: {
      local: {
        tokenKey: 'test',
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      },
      test: {
        _provider: '~/auth/test-provider.js',
        _scheme: '~/auth/test-scheme.js'
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
