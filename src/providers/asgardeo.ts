import type { ProviderOptions, ProviderPartialOptions } from '../types'
import type { OpenIDConnectSchemeOptions } from '../schemes'
import { assignDefaults } from '../utils/provider'

export interface AsgardeoProviderOptions
  extends ProviderOptions,
    OpenIDConnectSchemeOptions {
  issuer: string
}

export function asgardeo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _nuxt: any,
  strategy: ProviderPartialOptions<AsgardeoProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: 'openIDConnect',
    endpoints: {
      configuration: `${strategy.issuer}/oauth2/token/.well-known/openid-configuration`
    },
    scope: ['openid', 'profile', 'email']
  }

  assignDefaults(strategy, DEFAULTS)
}
