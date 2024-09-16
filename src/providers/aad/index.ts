import { assignDefaults, addAuthorize } from '../../utils/provider'

export default function aad (nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: 'oauth2',
    endpoints: {
      authorization: `https://login.microsoftonline.com/${strategy.tenantId}/oauth2/v2.0/authorize`,
      userInfo: 'https://graph.microsoft.com/v1.0/me',
      token: `https://login.microsoftonline.com/${strategy.tenantId}/oauth2/v2.0/token`
    },
    codeChallengeMethod: 'S256',
    scope: ['openid', 'profile'],
    autoLogout: true
  })

  addAuthorize(nuxt, strategy)
}
