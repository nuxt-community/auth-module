const { assignDefaults } = require('./_utils')

module.exports = function okta (strategy) {
  const DEFAULTS = {
    _scheme: 'oauth2',

    // client_id and okta_domain
    // MUST be set in the nuxt.config.js

    redirect: {
      callback: '/implicit/callback'
    },

    scope: 'openid profile email',

    server_id: 'default',
    response_type: 'id_token token',
    nonce: ``
  }

  const serverId = strategy.server_id ? strategy.server_id : DEFAULTS.server_id
  const baseEndpoint = `https://${strategy.domain}.okta.com/oauth2/${serverId}/v1`

  const ENDPOINTS = {
    authorization_endpoint: `${baseEndpoint}/authorize`,
    userinfo_endpoint: `${baseEndpoint}/userinfo`,
    token_endpoint: `${baseEndpoint}/token`,
    logout_endpoint: `${baseEndpoint}/logout`
  }

  assignDefaults(strategy, {
    ...ENDPOINTS,
    ...DEFAULTS
  })
}
