const providers = require('./auth/providers')

module.exports = {
  //  Error handling

  resetOnError: false,

  // Authorization

  scopeKey: 'scope',

  // Redirects

  rewriteRedirects: true,

  fullPathRedirect: false,

  redirect: {
    login: '/login',
    logout: '/',
    home: '/',
    callback: '/login'
  },

  // Vuex Store

  vuex: {
    namespace: 'auth'
  },

  // Cookie Store

  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  },

  // localStorage Store

  localStorage: {
    prefix: 'auth.'
  },

  // Token

  token: {
    prefix: '_token.'
  },

  // Refresh Token

  refreshToken: {
    prefix: '_refreshToken.',
    autoRefresh: true
  },

  // Providers
  providers: Object.assign({}, providers),

  // Strategies

  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {
    local: {
      endpoints: {
        login: {
          url: '/api/auth/login',
          method: 'post',
          propertyName: 'token'
        },
        logout: {
          url: '/api/auth/logout',
          method: 'post'
        },
        user: {
          url: '/api/auth/user',
          method: 'get',
          propertyName: 'user'
        }
      }
    }
  }
}
