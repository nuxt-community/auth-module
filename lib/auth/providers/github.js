module.exports = function (strategy) {
  Object.assign(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    scope: ['user']
  })
}
