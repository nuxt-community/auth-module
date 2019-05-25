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

  // -- Strategies --

  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {
    local: {}
  }
}
