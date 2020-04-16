const { assignDefaults } = require('./_utils')

module.exports = function auth0 (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    endpoints: {
      authorization: `https://${strategy.domain}/authorize`,
      userInfo: `https://${strategy.domain}/userinfo`
    },
    scope: ['openid', 'profile', 'email']
  })
}
