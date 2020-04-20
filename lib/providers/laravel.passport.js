const { assignDefaults, addAuthorize, assignAbsoluteEndpoints } = require('./_utils')

module.exports = function laravelPassport (strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required is laravel passport!')
  }

  assignDefaults(strategy, {
    _scheme: 'oauth2',
    _name: 'laravel.passport',
    endpoints: {
      authorization: url + '/oauth/authorize',
      token: url + '/oauth/token'
    },
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

  assignAbsoluteEndpoints.call(this, strategy)
  addAuthorize.call(this, strategy)
}
