const { assignDefaults } = require('./_utils')

module.exports = function google (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
    userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['openid', 'profile', 'email']
  })
}
