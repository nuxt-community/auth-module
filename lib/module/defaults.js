module.exports = {
  //  -- Error handling --

  resetOnError: false,

  // -- Authorization --

  scopeKey: 'scope',

  // -- Redirects --

  rewriteRedirects: true,

  fullPathRedirect: false,

  watchLoggedIn: true,

  redirect: {
    login: '/login',
    logout: '/',
    home: '/',
    callback: '/login'
  },

  //  -- Vuex Store --

  vuex: {
    namespace: 'auth'
  },

  // -- Cookie Store --

  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  },

  // -- localStorage Store --

  localStorage: {
    prefix: 'auth.'
  },

  // -- Token --

  token: {
    prefix: '_token.'
  },

  // -- Client ID --

  client_id: {
    prefix: '_client_id.'
  },

  // -- Remember --

  remember: {
    prefix: '_remember.'
  },

  // -- Strategies --

  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {
    local: {
      endpoints: {
        login: {
          url: '/api/auth/login',
          method: 'post',
          propertyName: 'token',
          clientId: 'client_id',
          rememberFor: 7
        },
        refresh: {
          url: '/api/auth/refresh',
          method: 'post',
          token: 'token',
          createdAt: 'created_at',
          expiresIn: 'expires_in',
          defaultExpirationTime: 1800,
          clientId: 'client_id',
          grantType: 'refresh_token',
          payloadProperties: {
            refreshToken: 'refresh_token',
            clientId: 'client_id',
            grantType: 'grant_type'
          },
          disableAutoRefresh: false
        },
        logout: {
          url: '/api/auth/logout',
          method: 'post',
          payloadProperties: {
            refreshToken: false,
            clientId: false
          }
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
