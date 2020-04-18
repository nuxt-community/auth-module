import { assignDefaults } from '../utils'

export function google (nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://accounts.google.com/o/oauth2/auth',
      userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    scope: ['openid', 'profile', 'email']
  })
}
