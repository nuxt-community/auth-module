const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function aad (strategy) {
  const defaults = {
    _scheme: 'oauth2',
    authorization_endpoint: `https://login.microsoftonline.com/${strategy.tenant_id}/oauth2/v2.0/authorize`,
    userinfo_endpoint: 'https://graph.microsoft.com/v1.0/me',
    scope: ['user.read'],
    token_endpoint: `https://login.microsoftonline.com/${strategy.tenant_id}/oauth2/v2.0/token`
  }
  assignDefaults(strategy, defaults)

  addAuthorize.call(this, strategy)
}
