const { resolve, join } = require('path')
const merge = require('lodash/merge')
const defaults = require('./defaults')

module.exports = function (moduleOptions) {
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // Enforce vuex store because auth depends on it
  if (!this.options.store) {
    throw new Error('[Auth] Enable vuex store by creating store/index.js')
  }

  // Normalize options.endpoints
  for (let key in options.endpoints) {
    let e = options.endpoints[key]
    if (typeof e === 'string') {
      e = { url: e }
    }
    e.method = e.method ? e.method.toLowerCase() : 'post'
    options.endpoints[key] = e
  }

  // Plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: 'auth/plugin.js',
    options
  })

  // Add plugin just after $axios
  const index = this.options.plugins.findIndex(p => /axios\.js$/.test(p.src || p))
  this.options.plugins.splice(index + 1, 0, join(this.options.buildDir, dst))

  // Middleware
  this.addTemplate({
    src: resolve(__dirname, './templates/middleware.js'),
    fileName: 'auth/middleware.js',
    options
  })

  // Utilities
  this.addTemplate({
    src: resolve(__dirname, './templates/utilities.js'),
    fileName: 'auth/utilities.js',
    options
  })

  // Class
  this.addTemplate({
    src: resolve(__dirname, './templates/auth.js'),
    fileName: 'auth/auth.js',
    options
  })
}
