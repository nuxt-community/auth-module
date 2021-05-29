import type {
  RefreshTokenOptions,
  TokenOptions,
  UserOptions,
  RecursivePartial,
  ProviderPartialOptions,
  ProviderOptions
} from '../types'
import type { Oauth2SchemeOptions, RefreshSchemeOptions } from '../schemes'

import {
  assignDefaults,
  addAuthorize,
  initializePasswordGrantFlow,
  assignAbsoluteEndpoints
} from '../utils/provider'

export interface LaravelPassportProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  url: string
}

export interface LaravelPassportPasswordProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export type PartialPassportOptions = ProviderPartialOptions<LaravelPassportProviderOptions>
export type PartialPassportPasswordOptions = ProviderPartialOptions<LaravelPassportPasswordProviderOptions>

function isPasswordGrant(
  strategy: PartialPassportOptions | PartialPassportPasswordOptions
): strategy is PartialPassportPasswordOptions {
  return strategy.grantType === 'password'
}

export function laravelPassport(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  nuxt: any,
  strategy: PartialPassportOptions | PartialPassportPasswordOptions
): void {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required is laravel passport!')
  }

  const defaults: RecursivePartial<{
    name: string
    token: TokenOptions
    refreshToken: RefreshTokenOptions
    user: UserOptions
  }> = {
    name: 'laravelPassport',
    token: {
      property: 'access_token',
      type: 'Bearer',
      name: 'Authorization',
      maxAge: 60 * 60 * 24 * 365
    },
    refreshToken: {
      property: 'refresh_token',
      data: 'refresh_token',
      maxAge: 60 * 60 * 24 * 30
    },
    user: {
      property: false
    }
  }

  if (isPasswordGrant(strategy)) {
    const _DEFAULTS: typeof strategy = {
      ...defaults,
      scheme: 'refresh',
      endpoints: {
        token: url + '/oauth/token',
        login: {
          baseURL: ''
        },
        refresh: {
          baseURL: ''
        },
        logout: false,
        user: {
          url: url + '/api/auth/user'
        }
      },
      grantType: 'password'
    }

    assignDefaults(strategy, _DEFAULTS)

    assignAbsoluteEndpoints(strategy)
    initializePasswordGrantFlow(nuxt, strategy)
  } else {
    const _DEFAULTS: typeof strategy = {
      ...defaults,
      scheme: 'oauth2',
      endpoints: {
        authorization: url + '/oauth/authorize',
        token: url + '/oauth/token',
        userInfo: url + '/api/auth/user',
        logout: false
      },
      responseType: 'code',
      grantType: 'authorization_code',
      scope: '*'
    }
    assignDefaults(strategy, _DEFAULTS)

    assignAbsoluteEndpoints(strategy)
    addAuthorize(nuxt, strategy)
  }
}
