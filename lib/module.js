const { resolve, join } = require('path')
const merge = require('lodash/merge')
const defaults = require('./defaults')

// Built-in supported schemes
const SCHEMES = ['local', 'auth0', 'oauth2']

module.exports = function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // -- Backward compatibility --

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

  // Extract providers
  const providers = options.providers
  delete options.providers

  // Core templates
  const templates = ['middleware.js', 'utilities.js', 'auth.js', 'storage.js']

  // Unique set of used schemes
  const schemes = new Set()

  // Shared context for providers
  const ctx = { schemes, templates, providers }

  // Process and extract strategies
  const strategies = Object.keys(options.strategies)
    .map(name =>
      processStrategy.call(this, options.strategies[name], name, ctx)
    )
    .filter(Boolean)

  delete options.strategies

  // Find defaultStrategy
  if (!options.defaultStrategy) {
    options.defaultStrategy = strategies[0]._name
  }

  // Copy all templates
  for (let t of templates) {
    this.addTemplate({
      src: resolve(__dirname, 'auth', t),
      fileName: join('auth', t)
    })
  }

  // Auth plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, 'auth/plugin.js'),
    fileName: 'auth/plugin.js',
    options: {
      options,
      schemes: Array.from(schemes),
      strategies
    }
  })

  // ...add plugin just after $axios
  const index = this.options.plugins.findIndex(p =>
    /axios\.js$/.test(p.src || p)
  )
  this.options.plugins.splice(index + 1, 0, join(this.options.buildDir, dst))
}

// -------------------------------------------
// processStrategy function
// -------------------------------------------
function processStrategy (strategy, name, ctx) {
  if (!strategy) {
    return
  }

  // _name property
  if (!strategy._name) {
    strategy._name = name
  }

  // _provider property
  if (!strategy._provider) {
    strategy._provider = strategy._name
  }

  // Apply provider
  if (ctx.providers[strategy._provider]) {
    ctx.providers[strategy._provider].call(this, strategy, ctx)
  }

  // _scheme property
  if (!strategy._scheme) {
    strategy._scheme = strategy._name
  }

  // Resolve _scheme
  if (SCHEMES.includes(strategy._scheme)) {
    strategy._scheme = `./schemes/${strategy._scheme}.js`
    ctx.templates.push(strategy._scheme)
  }

  // Warn and omit if _scheme is undefined
  if (!strategy._scheme) {
    // eslint-disable-next-line no-console
    console.error(
      '[WARN] [AUTH]',
      'Skipping invalid _scheme',
      `"${strategy._scheme}"`
    )
    return
  }

  // Add _scheme to runtime
  ctx.schemes.add(strategy._scheme)

  // Return strategy
  return strategy
}
