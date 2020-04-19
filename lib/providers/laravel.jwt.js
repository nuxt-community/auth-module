const { assignDefaults } = require('./_utils')

module.exports = function laravelJWT (strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('Url is required for Laravel JWT!')
  }

  assignDefaults(strategy, {
    _scheme: 'refresh',
    _name: 'laravel.jwt',
    endpoints: {
      login: {
        url: url + '/api/auth/login'
      },
      refresh: {
        url: url + '/api/auth/refresh'
      },
      logout: {
        url: url + '/api/auth/logout'
      },
      user: {
        url: url + '/api/auth/user'
      }
    },
    token: {
      property: 'access_token',
      maxAge: 3600
    },
    refreshToken: {
      property: false,
      data: false,
      maxAge: 1209600,
      required: false
    },
    user: {
      property: false
    },
    clientId: false,
    grantType: false
  })
}
