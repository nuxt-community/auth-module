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
        authorization_endpoint: 'https://nuxt-auth.auth0.com/authorize',
        userinfo_endpoint: 'https://nuxt-auth.auth0.com/userinfo',
        scope: ['openid', 'profile', 'email'],

        client_id: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv',
        redirect_uri: 'http://localhost:3000/login'
      },
      facebook: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://facebook.com/v2.12/dialog/oauth',
        userinfo_endpoint:
          'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
        scope: ['public_profile', 'email'],

        client_id: '1671464192946675',
        redirect_uri: 'http://localhost:3000/login'
      },
      google: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
        userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scope: ['openid', 'profile', 'email'],

        client_id:
          '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/login'
      },
      github: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://github.com/login/oauth/authorize',
        scope: ['user'],

        client_id: '56ab0511106a13cbb12c',
        redirect_uri: 'http://localhost:3000/login'
      },
      twitter: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://api.twitter.com/oauth/authorize',
        scope: ['user'],

        client_id: 'FAJNuxjMTicff6ciDKLiZ4t0D',
        redirect_uri: 'http://localhost:3000/login'
      }
    }
  }
}
