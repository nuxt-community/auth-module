const { resolve } = require('path')
const merge = require('lodash/merge')
const defaults = require('./defaults')

module.exports = function (moduleOptions) {
  const options = merge(defaults, moduleOptions, this.options.auth)

  // Plugin
  this.addPlugin({
    src: resolve(__dirname, './templates/auth.plugin.js'),
    fileName: 'auth.plugin.js',
    options
  })

  // Middleware
  this.addTemplate({
    src: resolve(__dirname, './templates/auth.middleware.js'),
    fileName: 'auth.middleware.js',
    options
  })

  // Store
  this.addTemplate({
    src: resolve(__dirname, './templates/auth.store.js'),
    fileName: 'auth.store.js',
    options
  })
}
