module.exports = {
  fetchUserOnLogin: true,
  resetOnError: true,
  namespace: 'auth',
  endpoints: {
    login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
    logout: { url: '/api/auth/logout', method: 'post' },
    user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
  },
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
  }
}
