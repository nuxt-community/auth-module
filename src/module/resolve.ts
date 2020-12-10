import { existsSync } from 'fs'
import { resolve } from 'path'
import consola from 'consola'

const logger = consola.withScope('nuxt:auth')
const builtInSchemes = ['local', 'cookie', 'oauth2', 'refresh']

export function resolveStrategies(nuxt, options) {
  const strategies = []
  const strategyScheme = new Map()

  for (const name of Object.keys(options.strategies)) {
    if (
      !options.strategies[name] ||
      options.strategies[name].enabled === false
    ) {
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

export function resolveScheme(nuxt, scheme) {
  if (typeof scheme !== 'string') {
    return
  }

  if (builtInSchemes.includes(scheme)) {
    return '~auth/schemes/' + scheme
  }

  try {
    const path = nuxt.resolvePath(scheme)

    if (existsSync(path)) {
      return path
    }
  } catch (e) {
    logger.fatal(`Scheme ${scheme} wasn't found!`)
  }
}

export function resolveProvider(nuxt, provider) {
  if (typeof provider === 'function') {
    return provider
  }

  if (typeof provider !== 'string') {
    return
  }

  const builtInProvider = resolve(__dirname, '../providers', provider)

  for (const _path of [provider, builtInProvider]) {
    try {
      const m = nuxt.resolver.requireModule(_path, { useESM: true })
      return m.default || m
    } catch (e) {
      // TODO: Check if e.code is not file not found, throw an error (can be parse error)
      // Ignore
    }
  }
}
