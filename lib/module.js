const { resolve, join } = require('path')
const merge = require('lodash/merge')
const defaults = require('./defaults')

// Built-in supported schemes
const SCHEMES = ['local']

module.exports = function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // -- Backward compability --

  if (options.endpoints) {
    // eslint-disable-next-line no-console
    console.error('[DEPRICATED] [AUTH]', '`auth.endpoints` has been moved into `auth.strategies.local`.')
    options.strategies.local = merge({}, options.strategies.local, { endpoints: options.endpoints })
    delete options.endpoints
  }

  if (options.watchLoggedIn) {
    // eslint-disable-next-line no-console
    console.error('[DEPRICATED] [AUTH]', '`watchLoggedIn` has been depricated. Use `redirect.logout` instead.')
    if (options.watchLoggedIn === false) {
      options.redirect.logout = false
    }
    delete options.watchLoggedIn
  }

  // Enforce vuex store because auth depends on it
  if (!this.options.store) {
    throw new Error('[ERR] [AUTH]', 'Enable vuex store by creating `store/index.js`.')
  }

  // Core templates
  const templates = ['middleware.js', 'utilities.js', 'auth.js']

  // -- Process strategies --
  const schemes = new Set()

  for (let name in options.strategies) {
    const strategy = options.strategies[name]

    // Skip disabled strategies
    if (!strategy) {
      delete options.strategies[name]
      continue
    }

    const schemeName = strategy._scheme || name

    // Built-in supported strategies
    if (SCHEMES.includes(schemeName)) {
      strategy._scheme = `./schemes/${schemeName}.js`
      templates.push(strategy._scheme)
    }

    // Warn and omit if _src is undefind
    if (!strategy._scheme) {
      // eslint-disable-next-line no-console
      console.error('[WARN] [AUTH]', 'Skipping invalid strategy:', `"${schemeName}"`)
      delete options.strategies[name]
    } else {
      schemes.add(strategy._scheme)
    }
  }

  // defaultStrategy
  if (!options.defaultStrategy) {
    options.defaultStrategy = Object.keys(options.strategies)[0]
  }

  // Extract options.strategies
  const strategies = options.strategies
  delete options.strategies

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
      schemes,
      strategies
    }
  })

  // ...add plugin just after $axios
  const index = this.options.plugins.findIndex(p => /axios\.js$/.test(p.src || p))
  this.options.plugins.splice(index + 1, 0, join(this.options.buildDir, dst))
}
