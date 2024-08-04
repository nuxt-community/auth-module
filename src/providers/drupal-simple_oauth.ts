import type { ProviderOptions, ProviderPartialOptions } from '../types'
import type { Oauth2SchemeOptions } from '../schemes'
import { assignDefaults } from '../utils/provider'

export interface DrupalSimpleOauthProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  url: string
}

export function drupalSimpleOauth(
  strategy: ProviderPartialOptions<DrupalSimpleOauthProviderOptions>
): void {
  const { url } = strategy

  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    name: 'drupalSimpleOauth',
    endpoints: {
      authorization: url + '/oauth/authorize',
      token: url + '/oauth/access_token',
      userInfo: url + '/oauth/userInfo'
    }
  }

  assignDefaults(strategy, DEFAULTS)
}
