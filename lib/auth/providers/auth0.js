const { assignDefaults } = require('./_utils')

module.exports = function (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://nuxt-auth.auth0.com/authorize',
    userinfo_endpoint: 'https://nuxt-auth.auth0.com/userinfo',
    scope: ['openid', 'profile', 'email']
  })
}
