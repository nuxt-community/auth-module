const { resolve, join, basename } = require('path')
const { existsSync, readdirSync } = require('fs')
const merge = require('lodash/merge')
const uniq = require('lodash/uniq')
const defaults = require('./defaults')
const consola = require('consola')

const libRoot = resolve(__dirname, '..')

const logger = consola.withScope('nuxt:auth')

module.exports = function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // Validate and Normalize options
  validateOptions.call(this, options)

  // Copy all core templates
  copyCore.call(this, options)

  // Process and normalize strategies
  const { strategies, strategyScheme } = processStrategies.call(this, options)
  delete options.strategies

  // Set defaultStrategy
  const strategyNames = strategies.map(x => x._name)
  options.defaultStrategy = options.defaultStrategy || strategyNames[0]

  if (!options.defaultStrategy) {
    logger.warn('no strategy defined!')
  } else if (strategyNames.indexOf(options.defaultStrategy) === -1) {
    logger.warn(`strategy ${options.defaultStrategy} is not defined!`)
  }

  // Copy plugin
  copyPlugin.call(this, { options, strategies, strategyScheme })

  // Transpile nanoid (used for oauth2) for IE11 support (#472)
  this.options.build.transpile.push(/^nanoid/)
}

function validateOptions (options) {
  if (options.endpoints) {
    // eslint-disable-next-line no-console
    logger.error('`auth.endpoints` has been moved into `auth.strategies.local`.')
    options.strategies.local = merge({}, options.strategies.local, {
      endpoints: options.endpoints
    })
    delete options.endpoints
  }

  // Enforce vuex store because auth depends on it
  if (options.vuex && !this.options.store) {
    logger.fatal('Enable vuex store by creating `store/index.js`.')
  }
}

function copyCore (options) {
  const coreRoot = resolve(libRoot, 'core')

  for (const file of readdirSync(coreRoot)) {
    this.addTemplate({
      src: resolve(coreRoot, file),
      fileName: join('auth', file)
    })
  }
}

function copyPlugin ({ options, strategies, strategyScheme }) {
  // Copy auth plugin
  const { dst } = this.addTemplate({
    src: resolve(libRoot, 'module', 'plugin.js'),
    fileName: join('auth', 'plugin.js'),
    options: {
      options,
      strategies,
      uniqueSchemes: uniq([...strategyScheme.values()]),
      strategyScheme
    }
  })

  this.options.plugins.push(resolve(this.options.buildDir, dst))

  // Extend auth with plugins
  if (options.plugins) {
    options.plugins.forEach(p => this.options.plugins.push(p))
    delete options.plugins
  }
}

function processStrategies (options) {
  const strategies = []
  const strategyScheme = new Map()

  for (const name in options.strategies) {
    if (!options.strategies[name]) {
      continue
    }

    // Clone strategy
    const strategy = Object.assign({}, options.strategies[name])

    // Guess _name property
    if (!strategy._name) {
      strategy._name = name
    }

    // Guess _provider property
    if (!strategy._provider) {
      strategy._provider = strategy._name
    }

    // Try to apply provider
    const provider = resolveProvider.call(this, strategy._provider)

    if (typeof provider === 'function') {
      provider.call(this, strategy, { name })
    }

    // Guess _scheme property
    if (!strategy._scheme) {
      strategy._scheme = strategy._name
    }

    // Resolve and copy scheme
    const schemeSrc = resolveScheme.call(this, strategy._scheme)

    if (!schemeSrc) {
      // Scheme is mandatory but is invalid
      continue
    }

    const schemeName = basename(schemeSrc)

    this.addTemplate({
      src: schemeSrc,
      fileName: join('auth', 'schemes', schemeName)
    })

    // Remove unnecessary fields
    delete strategy._scheme
    delete strategy._provider

    strategyScheme.set(strategy, '.' + join('/', 'schemes', basename(schemeSrc)))
    strategies.push(strategy)
  }

  return {
    strategies,
    strategyScheme
  }
}

function resolveProvider (provider) {
  if (typeof provider === 'function') {
    return provider
  }

  if (typeof provider !== 'string') {
    return
  }

  let path = resolve(libRoot, 'providers', provider + '.js')

  if (existsSync(path)) {
    return require(path)
  }

  try {
    path = this.nuxt.resolvePath(provider)
  } catch (e) {
    // Ignore
  }

  if (existsSync(path)) {
    return require(path)
  }
}

function resolveScheme (scheme) {
  if (typeof scheme !== 'string') {
    return
  }

  let path = resolve(libRoot, 'schemes', scheme + '.js')

  if (existsSync(path)) {
    return path
  }

  try {
    path = this.nuxt.resolvePath(scheme)
  } catch (e) {
    // Ignore
  }

  if (existsSync(path)) {
    return path
  }
}
