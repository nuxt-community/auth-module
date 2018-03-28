const { assignDefaults, addAuthorize } = require('./_utils')

module.exports = function (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    response_type: 'code',
    grant_type: 'authorization_code',
    decode_resource_access: true,
    auto_refresh_token: true,
    authorization_endpoint: `${strategy.server}/auth/realms/${strategy.realm}/protocol/openid-connect/auth`,
    userinfo_endpoint: `${strategy.server}/auth/realms/${strategy.realm}/protocol/openid-connect/userinfo`,
    access_token_endpoint: `${strategy.server}/auth/realms/${strategy.realm}/protocol/openid-connect/token`
  })
}
