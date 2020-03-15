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

  // -- Tokens --

  token: {
    prefix: '_token.'
  },

  tokenExpiration: {
    prefix: '_token_expiration.'
  },

  // -- Refresh token --

  refreshToken: {
    prefix: '_refresh_token.'
  },

  refreshTokenExpiration: {
    prefix: '_refresh_token_expiration.'
  },

  token_type: 'Bearer',

  // -- Strategies --

  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {}
}
