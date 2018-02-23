const { assignDefaults } = require('./_utils')

module.exports = function (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://api.twitter.com/oauth/authorize',
    scope: ['user']
  })
}
