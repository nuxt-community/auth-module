const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function laravelPassport (strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required is laravel sanctum!')
  }

  const endpoints = {
    authorization: url + '/oauth/authorize',
    token: url + '/oauth/token'
  }

  if (strategy.endpoints) {
    for (const key of Object.keys(strategy.endpoints)) {
      const endpointUrl = strategy.endpoints[key]

      if (endpointUrl) {
        endpoints[key] = url + endpointUrl
        delete strategy.endpoints[key]
      }
    }
  }

  assignDefaults(strategy, {
    _scheme: 'oauth2',
    _name: 'laravel.passport',
    endpoints,
    token: {
      property: 'access_token',
      type: 'Bearer',
      name: 'Authorization',
      maxAge: 60 * 60 * 24 * 365
    },
    refreshToken: {
      property: 'refresh_token',
      maxAge: 60 * 60 * 24 * 30
    },
    responseType: 'code',
    grantType: 'authorization_code',
    scope: '*'
  })

  addAuthorize.call(this, strategy)
}
