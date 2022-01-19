import type { ProviderOptions, ProviderPartialOptions } from '../types'
import type { Oauth2SchemeOptions } from '../schemes'
import { assignDefaults, addAuthorize } from '../utils/provider'

export interface SpotifyProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export function spotify(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  nuxt: any,
  strategy: ProviderPartialOptions<SpotifyProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://accounts.spotify.com/authorize',
      token: 'https://accounts.spotify.com/api/token',
      userInfo: 'https://api.spotify.com/v1/me'
    },
    grantType: 'authorization_code',
    scope: ['user-read-private']
  }

  assignDefaults(strategy, DEFAULTS)

  addAuthorize(nuxt, strategy, true)
}
