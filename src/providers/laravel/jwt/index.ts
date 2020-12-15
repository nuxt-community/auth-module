import type { ProviderPartialOptions, ProviderOptions, RefreshSchemeOptions } from 'src'
import path from 'path'
import { assignDefaults, assignAbsoluteEndpoints } from 'src/utils/provider'

export interface LaravelJWTProviderOptions extends ProviderOptions, RefreshSchemeOptions {
  url: string
}

export default function laravelJWT(
  _nuxt: any,
  strategy: ProviderPartialOptions<LaravelJWTProviderOptions>
): void {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required for laravel jwt!')
  }

  const DEFAULTS: typeof strategy = {
    scheme: path.resolve(__dirname, 'scheme'),
    name: 'laravelJWT',
    endpoints: {
      login: {
        url: url + '/api/auth/login'
      },
      refresh: {
        url: url + '/api/auth/refresh'
      },
      logout: {
        url: url + '/api/auth/logout'
      },
      user: {
        url: url + '/api/auth/user'
      }
    },
    token: {
      property: 'access_token',
      maxAge: 3600
    },
    refreshToken: {
      property: false,
      data: false,
      maxAge: 1209600,
      required: false,
      tokenRequired: true
    },
    user: {
      property: false
    },
    clientId: false,
    grantType: false
  }

  assignDefaults(strategy, DEFAULTS)

  assignAbsoluteEndpoints(strategy)
}
