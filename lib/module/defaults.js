module.exports = {
  //  -- Error handling --

  resetOnError: false,

  // -- Authorization --

  scopeKey: 'scope',

  // -- Redirects --

  rewriteRedirects: true,

  fullPathRedirect: false,

  watchLoggedIn: true,

  logoutOnError: false,

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

  // -- Refresh token --

  refresh_token: {
    prefix: '_refresh_token.'
  },

  expires_at: {
    prefix: '_expires_at.'
  },

  // -- Strategies --

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
