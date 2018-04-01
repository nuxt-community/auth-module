const { resolve, join, basename } = require('path')
const { existsSync, readdirSync } = require('fs')
const merge = require('lodash/merge')
const defaults = require('./defaults')

const libRoot = resolve(__dirname, '..')

module.exports = function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // Validate and Normalize options
  validateOptions.call(this, options)

  // Copy all core templates
  copyCore.call(this, options)

  // Process and normalize strategies
  const { strategies, schemes } = processStrategies.call(this, options)

  // Set defaultStrategy
  if (!options.defaultStrategy) {
    options.defaultStrategy = strategies[0]._name
  }

  // Copy plugin
  copyPlugin.call(this, { options, strategies, schemes })
}

function validateOptions (options) {
  if (options.endpoints) {
    // eslint-disable-next-line no-console
    console.error(
      '[DEPRECATED] [AUTH] ' +
      '`auth.endpoints` has been moved into `auth.strategies.local`.'
    )
    options.strategies.local = merge({}, options.strategies.local, {
      endpoints: options.endpoints
    })
    delete options.endpoints
  }

  if (options.watchLoggedIn) {
    // eslint-disable-next-line no-console
    console.error(
      '[DEPRECATED] [AUTH] ' +
      '`watchLoggedIn` has been deprecated. Use `redirect.logout` instead.'
    )
    if (options.watchLoggedIn === false) {
      options.redirect.logout = false
    }
    delete options.watchLoggedIn
  }

  // Enforce vuex store because auth depends on it
  if (!this.options.store) {
    throw new Error(
      '[ERR] [AUTH] ' +
      'Enable vuex store by creating `store/index.js`.'
    )
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

function copyPlugin ({ options, strategies, schemes }) {
  // Copy auth plugin
  const { dst } = this.addTemplate({
    src: resolve(libRoot, 'module', 'plugin.js'),
    fileName: join('auth', 'plugin.js'),
    options: {
      options,
      schemes,
      strategies
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
  const schemes = {}

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
      strategy._provider = provider.name || ''
    } else {
      delete strategy._provider
    }

    // Guess _scheme property
    if (!strategy._scheme) {
      strategy._scheme = strategy._name
    }

    // Resolve and copy scheme
    const schemeSrc = resolveScheme.call(this, strategy._scheme)

    if (!schemeSrc) {
      // Scheme is mondatory but is invalid
      continue
    }

    const schemeName = basename(schemeSrc)

    this.addTemplate({
      src: schemeSrc,
      fileName: join('auth', 'schemes', schemeName)
    })

    schemes[schemeName] = '.' + join('/', 'schemes', basename(schemeSrc))
    strategy._scheme = schemeName

    strategies.push(strategy)
  }

  return {
    strategies,
    schemes
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
