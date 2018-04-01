const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function github (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    token_endpoint: 'https://github.com/login/oauth/access_token',
    userinfo_endpoint: 'https://api.github.com/user',

    scope: ['user', 'email']
  })

  addAuthorize.call(this, strategy)
}
