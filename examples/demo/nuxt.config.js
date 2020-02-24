const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  build: {
    extractCSS: true
  },
  serverMiddleware: [
    '../api/auth',
    '../api/oauth2mockserver'
  ],
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@@'],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/signed-out'
    },
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      },
      auth0: {
        domain: 'nuxt-auth.auth0.com',
        client_id: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv'
      },
      facebook: {
        client_id: '1671464192946675',
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday',
        scope: ['public_profile', 'email', 'user_birthday']
      },
      google: {
        client_id:
          '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com'
      },
      github: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET
      },
      twitter: {
        client_id: 'FAJNuxjMTicff6ciDKLiZ4t0D'
      },
      oauth2mock: {
        _scheme: 'oauth2',
        response_type: 'code',
        grant_type: 'authorization_code',
        authorization_endpoint: '/oauth2mockLogin',
        access_token_endpoint: '/oauth2mockserver/token',
        userinfo_endpoint: '/oauth2mockserver/userinfo',
        client_id: 'test-client'
      }
    }
  }
}
