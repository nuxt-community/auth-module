import path from 'path'
import { assignDefaults } from '../../utils/provider'

export default function auth0 (_nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: path.resolve(__dirname, 'scheme'),
    endpoints: {
      authorization: `https://${strategy.domain}/authorize`,
      userInfo: `https://${strategy.domain}/userinfo`
    },
    scope: ['openid', 'profile', 'email']
  })
}
