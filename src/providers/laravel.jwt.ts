const { assignDefaults } = require('./_utils')

export function laravelJWT (_nuxt, strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required for laravel jwt!')
  }

  const endpoints = {
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
  }

  if (strategy.endpoints) {
    for (const key of Object.keys(strategy.endpoints)) {
      const endpointUrl = strategy.endpoints[key].url

      if (endpointUrl) {
        endpoints[key].url = url + endpointUrl
        delete strategy.endpoints[key].url
      }
    }
  }

  assignDefaults(strategy, {
    _scheme: 'refresh',
    _name: 'laravel.jwt',
    endpoints,
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
