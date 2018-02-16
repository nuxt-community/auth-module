module.exports = {
  resetOnError: false,
  rewriteRedirects: true,
  namespace: 'auth',
  scopeKey: 'scope',
  defaultStrategy: undefined, /* will be auto set at module level */

  redirect: {
    login: '/login',
    logout: '/',
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

  strategies: {
    local: {
      endpoints: {
        login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/api/auth/logout', method: 'post' },
        user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
      }
    }
  }
}
