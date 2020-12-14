import { assignDefaults } from 'src/utils/provider'
import { ProviderPartialOptions } from 'src/providers'
import FacebookProviderOptions from './contracts/FacebookProviderOptions'

export default function facebook(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _nuxt: any,
  strategy: ProviderPartialOptions<FacebookProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://facebook.com/v2.12/dialog/oauth',
      userInfo:
        'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email'
    },
    scope: ['public_profile', 'email']
  }

  assignDefaults(strategy, DEFAULTS)
}
