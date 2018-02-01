const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  serverMiddleware: [
    '~/api/auth'
  ],
  modules: ['@nuxtjs/axios', '@@']
}
