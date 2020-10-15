import { assignDefaults, addAuthorize } from '../../utils/provider'

export default function o365 (nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: 'oauth2',
    authorization: `https://login.microsoftonline.com/${strategy.tenantId}/oauth2/v2.0/authorize`,
    userInfo: 'https://graph.microsoft.com/v1.0/me',
    scope: ['user.read'],
    token: `https://login.microsoftonline.com/${strategy.tenantId}/oauth2/v2.0/token`
  })

  addAuthorize(nuxt, strategy)
}
