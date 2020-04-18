const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  serverMiddleware: ['@@/demo/api/auth'],
  auth: {
    plugins: [
      '~/plugins/auth.js'
    ],
    strategies: {
      local: {
        token: {
          property: 'token.accessToken'
        }
      },
      localRefresh: {
        scheme: 'refresh',
        token: {
          property: 'token.accessToken',
          maxAge: 15
        },
        refreshToken: {
          property: 'token.refreshToken',
          data: 'refreshToken',
          maxAge: false
        },
        clientId: {
          property: 'token.clientId',
          data: 'clientId'
        },
        grantType: {
          data: 'grantType'
        }
      },
      test: {
        provider: '~/auth/test-provider.js',
        scheme: '~/auth/test-scheme.js'
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
