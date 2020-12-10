import { assignDefaults } from '../../utils/provider'
import ProviderPartialOptions from '../contracts/ProviderPartialOptions'
import GoogleProviderOptions from './contracts/GoogleProviderOptions'

export default function google(
  _nuxt,
  strategy: ProviderPartialOptions<GoogleProviderOptions>
) {
  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://accounts.google.com/o/oauth2/auth',
      userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    scope: ['openid', 'profile', 'email']
  }

  assignDefaults(strategy, DEFAULTS)
}
