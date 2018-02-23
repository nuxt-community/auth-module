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
        _scheme: 'oauth2',
        clientId: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv',
        authorizationUri: 'https://nuxt-auth.auth0.com/authorize',
        userinfoUri: 'https://nuxt-auth.auth0.com/userinfo',
        redirectUri: 'http://localhost:3000/login',
        scopes: ['openid', 'profile', 'email']
      },
      facebook: {
        _scheme: 'oauth2',
        clientId: '1671464192946675',
        authorizationUri: 'https://facebook.com/v2.12/dialog/oauth',
        userinfoUri:
          'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
        redirectUri: 'http://localhost:3000/login',
        scopes: ['public_profile', 'email']
      },
      google: {
        _scheme: 'oauth2',
        clientId:
          '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com',
        authorizationUri: 'https://accounts.google.com/o/oauth2/auth',
        userinfoUri: 'https://www.googleapis.com/oauth2/v3/userinfo',
        redirectUri: 'http://localhost:3000/login',
        scopes: ['openid', 'profile', 'email']
      }
      // github: {
      //   _scheme: 'oauth2',
      //   clientId: '56ab0511106a13cbb12c',
      //   authorizationUri: 'https://github.com/login/oauth/authorize',
      //   redirectUri: 'http://localhost:3000/login',
      //   scopes: ['user']
      // },
      // twitter: {
      //   _scheme: 'oauth2',
      //   clientId: 'FAJNuxjMTicff6ciDKLiZ4t0D',
      //   authorizationUri: 'https://api.twitter.com/oauth/authorize',
      //   redirectUri: 'http://localhost:3000/login',
      //   scopes: ['user']
      // }
    }
  }
}
