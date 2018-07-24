const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function discord (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://discordapp.com/api/oauth2/authorize',
    token_endpoint: 'https://discordapp.com/api/oauth2/token',
    userinfo_endpoint: 'https://discordapp.com/api/users/@me',
    response_type: 'code',
    grant_type: 'authorization_code',
    tokenParams: true,
    authHeader: true,

    scope: ['identify', 'email']
  })

  addAuthorize.call(this, strategy)
}
