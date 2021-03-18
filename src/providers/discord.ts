import type { ProviderOptions, ProviderPartialOptions } from '../types'
import type { Oauth2SchemeOptions } from '../schemes'
import { assignDefaults, addAuthorize } from '../utils/provider'

export interface DiscordProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export function discord(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  nuxt: any,
  strategy: ProviderPartialOptions<DiscordProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://discord.com/api/oauth2/authorize',
      token: 'https://discord.com/api/oauth2/token',
      userInfo: 'https://discord.com/api/users/@me'
    },
    scope: ['identify', 'email']
  }

  assignDefaults(strategy, DEFAULTS)

  addAuthorize(nuxt, strategy, true)
}
