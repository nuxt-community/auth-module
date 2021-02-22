const { Provider } = require('oidc-provider')
const defu = require('defu')

// Suppress oidc-provider logging on test run
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line no-console
  console.warn = () => {
    /* Do nothing */
  }
  // eslint-disable-next-line no-console
  console.info = () => {
    /* Do nothing */
  }
}

const DEFAULTS = {
  port: 3000,
  path: '/oidc',
  redirect: {
    callback: '/login'
  }
}

const provider = (config) => {
  const { port, redirect, path } = defu(config, DEFAULTS)
  const baseUrl = `http://localhost:${port}${path}`
  const appBaseUrl = `http://localhost:${port}`
  const redirectUri = `${appBaseUrl}${redirect.callback}`

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
    issueRefreshToken: () => Promise.resolve(true)
  })
}

module.exports = (config = {}) => provider(config).callback
