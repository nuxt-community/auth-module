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
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@@'],
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
        client_id: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv',
        redirect_uri: 'http://localhost:3000/login'
      },
      facebook: {
        client_id: '1671464192946675',
        redirect_uri: 'http://localhost:3000/login'
      },
      google: {
        client_id:
          '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/login'
      },
      github: {
        client_id: '56ab0511106a13cbb12c',
        redirect_uri: 'http://localhost:3000/login'
      },
      twitter: {
        client_id: 'FAJNuxjMTicff6ciDKLiZ4t0D',
        redirect_uri: 'http://localhost:3000/login'
      }
    }
  }
}
