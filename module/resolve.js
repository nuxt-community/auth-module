import { existsSync } from 'fs'
import * as providers from './providers'

const builtInSchemes = [
  'local',
  'oauth2',
  'refresh'
]

export function resolveStrategies (nuxt, options) {
  const strategies = []
  const strategyScheme = new Map()

  for (const name in strategies) {
    if (!options.strategies[name] || options.strategies[name].enabled === false) {
      continue
    }

    // Clone strategy
    const strategy = Object.assign({}, options.strategies[name])

    // Default name
    if (!strategy.name) {
      strategy.name = name
    }

    // Default provider (same as name)
    if (!strategy.provider) {
      strategy.provider = strategy.name
    }

    // Try to resolve provider
    const provider = resolveProvider(nuxt, strategy.provider)
    delete strategy.provider

    if (typeof provider === 'function') {
      provider(nuxt, strategy)
    }

    // Default scheme (same as name)
    if (!strategy.scheme) {
      strategy.scheme = strategy.name
    }

    // Resolve and keep scheme needed for strategy
    const scheme = resolveScheme(nuxt, strategy.scheme)
    delete strategy.scheme
    strategyScheme.set(strategy, scheme)

    // Add strategy to array
    strategies.push(strategy)
  }

  return {
    strategies,
    strategyScheme
  }
}

export function resolveScheme (nuxt, scheme) {
  if (typeof scheme !== 'string') {
    return
  }

  if (builtInSchemes.includes(scheme)) {
    return '~auth/schemes/' + scheme
  }

  const path = nuxt.resolvePath(scheme)

  if (existsSync(path)) {
    return path
  }
}

export function resolveProvider (nuxt, provider) {
  if (typeof provider === 'function') {
    return provider
  }

  if (typeof provider !== 'string') {
    return
  }

  if (providers[provider]) {
    return providers[provider]
  }

  const path = nuxt.resolvePath(provider)

  if (existsSync(path)) {
    return require(path)
  }
}
