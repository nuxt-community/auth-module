const { assignDefaults } = require('./_utils')

module.exports = function facebook (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://facebook.com/v2.12/dialog/oauth',
    userinfo_endpoint:
      'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
    scope: ['public_profile', 'email']
  })
}
