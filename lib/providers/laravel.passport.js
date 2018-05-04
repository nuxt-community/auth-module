const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function laravelPassport (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    _name: 'laravel.passport',
    authorization_endpoint: `${strategy.url}/oauth/authorize`,
    token_endpoint: `${strategy.url}/oauth/token`,
    token_key: 'access_token',
    token_type: 'Bearer',
    response_type: 'code',
    grant_type: 'authorization_code',
    scope: '*'
  })

  addAuthorize.call(this, strategy)
}
