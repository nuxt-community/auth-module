module.exports = {
  resetOnError: false,
  rewriteRedirects: true,
  watchLoggedIn: true,

  namespace: 'auth',

  scopeKey: 'scope',

  redirect: {
    login: '/login',
    home: '/'
  },

  token: {
    type: 'Bearer',
    name: 'token'
  },

  cookie: {
    name: 'token',
    options: {
      path: '/'
    }
  },

  // Endpoints used for default local strategy
  endpoints: {
    login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
    logout: { url: '/api/auth/logout', method: 'post' },
    user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
  }
}
