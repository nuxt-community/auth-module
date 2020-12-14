import path from 'path'
import { assignDefaults } from '../../utils/provider'
import { ProviderPartialOptions } from '../index'
import Auth0ProviderOptions from './contracts/Auth0ProviderOptions'

export default function auth0(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _nuxt: any,
  strategy: ProviderPartialOptions<Auth0ProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: path.resolve(__dirname, 'scheme'),
    endpoints: {
      authorization: `https://${strategy.domain}/authorize`,
      userInfo: `https://${strategy.domain}/userinfo`,
      token: `https://${strategy.domain}/oauth/token`,
      logout: `https://${strategy.domain}/v2/logout`
    },
    scope: ['openid', 'profile', 'email']
  }

  assignDefaults(strategy, DEFAULTS)
}
