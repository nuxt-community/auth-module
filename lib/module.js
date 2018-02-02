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
    src: resolve(__dirname, './auth.plugin.tmpl.js'),
    fileName: 'auth.plugin.js',
    options
  })

  // Add plugin just after $axios
  const index = this.options.plugins.findIndex(p => (p.src || p).includes('/axios.js'))
  this.options.plugins.splice(index + 1, 0, join(this.options.buildDir, dst))

  // Class
  this.addTemplate({
    src: resolve(__dirname, './auth.js'),
    fileName: 'auth.js',
    options
  })
}
