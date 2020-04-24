const { assignDefaults, assignAbsoluteEndpoints } = require('./_utils')

export function laravelJWT (_nuxt, strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required for laravel jwt!')
  }

  assignDefaults(strategy, {
    scheme: 'refresh',
    name: 'laravelJWT',
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

  assignAbsoluteEndpoints(strategy)
}
