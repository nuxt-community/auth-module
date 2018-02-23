module.exports = function (strategy) {
  Object.assign(strategy, {
    _scheme: 'oauth2',
    authorization_endpoint: 'https://nuxt-auth.auth0.com/authorize',
    userinfo_endpoint: 'https://nuxt-auth.auth0.com/userinfo',
    scope: ['openid', 'profile', 'email']
  })
}
