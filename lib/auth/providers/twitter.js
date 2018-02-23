module.exports = function (strategy) {
  Object.assign(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://api.twitter.com/oauth/authorize',
    scope: ['user']
  })
}
