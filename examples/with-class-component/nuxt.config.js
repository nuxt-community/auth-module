const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  buildDir: resolve(__dirname, '.nuxt'),
  dev: false,
  render: {
    resourceHints: false
  },
  build: {
    extractCSS: true,
    babel: {
      plugins: ['transform-decorators-legacy', 'transform-class-properties']
    }
  },
  serverMiddleware: ['../api/auth'],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      }
    }
  },
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@nuxtjs/toast', '@@'],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
