const { assignDefaults } = require('./_utils')

module.exports = function facebook (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    endpoints: {
      authorization: 'https://facebook.com/v2.12/dialog/oauth',
      userInfo: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email'
    },
    scope: ['public_profile', 'email']
  })
}
