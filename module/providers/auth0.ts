import { assignDefaults } from '../utils'

export function auth0 (_nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: 'oauth2',
    endpoints: {
      authorization: `https://${strategy.domain}/authorize`,
      userInfo: `https://${strategy.domain}/userinfo`
    },
    scope: ['openid', 'profile', 'email']
  })
}
