const { Provider } = require('oidc-provider')

const provider = (port = 3000) => {
  const baseUrl = `http://localhost:${port}/oidc`
  const appBaseUrl = `http://localhost:${port}`
  const redirectUri = `${appBaseUrl}/callback`

  return new Provider(baseUrl, {
    routes: {
      authorization: '/connect/authorize',
      token: '/connect/token',
      userinfo: '/connect/userinfo',
      end_session: '/connect/endsession'
    },
    features: {
      devInteractions: { enabled: true },
      clientCredentials: { enabled: false },
      introspection: { enabled: true },
      revocation: { enabled: true }
    },
    formats: {
      AccessToken: 'jwt'
    },
    scopes: ['openid', 'profile', 'offline_access'],
    claims: {
      email: ['email'],
      profile: ['name', 'profile']
    },
    clients: [
      {
        client_id: 'nuxt_auth_oidc_client',
        client_secret: 'this_is_a_secret',
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        redirect_uris: [redirectUri],
        post_logout_redirect_uris: [appBaseUrl]
      }
    ],
    findAccount: async (_ctx, id) => ({
      accountId: id,
      claims: async () => ({
        sub: id,
        auth_time: new Date().getTime(),
        idp: 'local',
        amr: 'pwd'
      })
    }),
    issueRefreshToken: async () => {
    // Force refresh token issueing
      return true
    }
  })
}

module.exports = (req, res, port) => provider(port).callback(req, res)
