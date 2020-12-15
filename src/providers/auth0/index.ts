import type { ProviderOptions, ProviderPartialOptions, Oauth2SchemeOptions } from 'src'
import path from 'path'
import { assignDefaults } from 'src/utils/provider'

export interface Auth0ProviderOptions
  extends ProviderOptions,
  Oauth2SchemeOptions {
  domain: string
}

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
