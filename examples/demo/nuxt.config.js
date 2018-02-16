const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  build: {
    extractCSS: true
  },
  serverMiddleware: ['../api/auth'],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@@'
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      },
      auth0: {
        clientID: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv',
        domain: 'nuxt-auth.auth0.com'
      }
    }
  }
}
