/* eslint-disable no-console */
const { Provider } = require('oidc-provider')

// Suppress oidc-provider errors on test run
if (process.env.NODE_ENV === 'test') {
  console.warn = () => { /* Do nothing */ }
  console.info = () => { /* Do nothing */ }
}

const provider = (port = 3000) => {
  const baseUrl = `http://localhost:${port}/oidc`
  const appBaseUrl = `http://localhost:${port}`
  const redirectUri = `${appBaseUrl}/login`

  return new Provider(baseUrl, {
    routes: {
      authorization: '/connect/authorize',
      token: '/connect/token',
      userinfo: '/connect/userinfo',
      end_session: '/connect/endsession'
    },
    features: {
      devInteractions: { enabled: true },
      revocation: { enabled: true }
    },
    scopes: ['openid', 'profile', 'offline_access'],
    clients: [
      {
        client_id: 'oidc_authorization_code_client',
        client_secret: 'this_is_a_secret',
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        redirect_uris: [redirectUri],
        post_logout_redirect_uris: [appBaseUrl]
      }
    ],

    // Force refresh token issueing
    issueRefreshToken: async () => {
      return true
    }
  })
}

module.exports = (req, res, port) => provider(port).callback(req, res)
