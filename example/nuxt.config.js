const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  serverMiddleware: ['~/api/auth'],
  auth: {
    endpoints: {
      login: { propertyName: 'token.accessToken' }
    },
    redirect: {
      home: '/profile'
    }
  },
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@@']
}
