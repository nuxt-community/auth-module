export default {
  //  -- Error handling --

  resetOnError: false,

  // -- Authorization --
  authorize: {
    scopeKey: 'scope'
  },

  // -- Redirects --

  watchLoggedIn: true,

  redirect: {
    rewrite: true,
    fullPath: false,
    paths: {
      login: '/login',
      logout: '/',
      home: '/',
      callback: '/login'
    }
  },

  // -- Cookie Store --

  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  },

  token_type: 'Bearer',

  // -- Strategies --

  defaultStrategy: undefined,

  strategies: {}
}
