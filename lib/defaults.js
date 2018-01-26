module.exports = {
  user: {
    endpoint: 'auth/user',
    propertyName: 'user',
    resetOnFail: true,
    enabled: true,
    method: 'GET'
  },
  login: {
    endpoint: 'auth/login'
  },
  logout: {
    endpoint: 'auth/logout',
    method: 'GET'
  },
  redirect: {
    guest: true,
    user: true,
    notLoggedIn: '/login',
    loggedIn: '/'
  },
  token: {
    enabled: true,
    type: 'Bearer',
    localStorage: true,
    name: 'token',
    cookie: true,
    cookieName: 'token'
  },
  errorHandler: {
    fetch: null,
    logout: null
  }
}
