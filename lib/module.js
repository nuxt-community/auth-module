const { resolve, join } = require('path')
const merge = require('lodash/merge')
const defaults = require('./defaults')

module.exports = function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // Enforce vuex store because auth depends on it
  if (!this.options.store) {
    throw new Error('[Auth] Enable vuex store by creating store/index.js')
  }

  // Enabled schemes
  const schemes = ['local']

  // Copy all templates
  const templates = ['middleware.js', 'utilities.js', 'auth.js']
    .concat(schemes.map(s => `schemes/${s}.js`))

  for (let t of templates) {
    this.addTemplate({
      src: resolve(__dirname, 'auth', t),
      fileName: join('auth', t),
      options
    })
  }

  // Plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, 'auth/plugin.js'),
    fileName: 'auth/plugin.js',
    options
  })

  // Add plugin just after $axios
  const index = this.options.plugins.findIndex(p => /axios\.js$/.test(p.src || p))
  this.options.plugins.splice(index + 1, 0, join(this.options.buildDir, dst))
}
