import { existsSync } from 'fs'
import hash from 'hasha'
import * as AUTH_PROVIDERS from './providers'
import { ProviderAliases } from './providers'
import type { ModuleOptions } from './options'
import type { Strategy } from './types'

const BuiltinSchemes = {
  local: 'LocalScheme',
  cookie: 'CookieScheme',
  oauth2: 'Oauth2Scheme',
  openIDConnect: 'OpenIDConnectScheme',
  refresh: 'RefreshScheme',
  laravelJWT: 'LaravelJWTScheme',
  auth0: 'Auth0Scheme'
}

export interface ImportOptions {
  name: string
  as: string
  from: string
}

export function resolveStrategies(
  nuxt: any,
  options: ModuleOptions
): { strategies: Strategy[]; strategyScheme: Record<string, ImportOptions> } {
  const strategies: Strategy[] = []
  const strategyScheme = {} as Record<string, ImportOptions>

  for (const name of Object.keys(options.strategies)) {
    if (
      !options.strategies[name] ||
      options.strategies[name].enabled === false
    ) {
      continue
    }

    // Clone strategy
    const strategy: Strategy = Object.assign({}, options.strategies[name])

    // Default name
    if (!strategy.name) {
      strategy.name = name
    }

    // Default provider (same as name)
    if (!strategy.provider) {
      strategy.provider = strategy.name
    }

    // Try to resolve provider
    const provider: (...args: unknown[]) => unknown = resolveProvider(
      nuxt,
      strategy.provider
    )
    delete strategy.provider

    if (typeof provider === 'function') {
      provider(nuxt, strategy)
    }

    // Default scheme (same as name)
    if (!strategy.scheme) {
      strategy.scheme = strategy.name
    }

    // Resolve and keep scheme needed for strategy
    const schemeImport = resolveScheme(nuxt, strategy.scheme)
    delete strategy.scheme
    strategyScheme[strategy.name] = schemeImport

    // Add strategy to array
    strategies.push(strategy)
  }

  return {
    strategies,
    strategyScheme
  }
}

export function resolveScheme(nuxt: any, scheme: string): ImportOptions {
  if (typeof scheme !== 'string') {
    return
  }

  if (BuiltinSchemes[scheme]) {
    return {
      name: BuiltinSchemes[scheme],
      as: BuiltinSchemes[scheme],
      from: '~auth/runtime'
    }
  }

  const path = nuxt.resolvePath(scheme)
  if (existsSync(path)) {
    const _path = path.replace(/\\/g, '/')
    return {
      name: 'default',
      as: 'Scheme$' + hash(_path).substr(0, 4),
      from: _path
    }
  }
}

export function resolveProvider(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  nuxt: any,
  provider: string | ((...args: unknown[]) => unknown)
): (...args: unknown[]) => unknown {
  if (typeof provider === 'function') {
    return provider
  }

  if (typeof provider !== 'string') {
    return
  }

  provider = (ProviderAliases[provider] || provider) as string

  if (AUTH_PROVIDERS[provider]) {
    return AUTH_PROVIDERS[provider]
  }

  try {
    const m = nuxt.resolver.requireModule(provider, { useESM: true })
    return m.default || m
  } catch (e) {
    // TODO: Check if e.code is not file not found, throw an error (can be parse error)
    // Ignore
  }
}
