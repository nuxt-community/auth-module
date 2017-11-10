const { resolve } = require('path')
const merge = require('lodash/merge')

module.exports = function (moduleOptions) {
  // Apply defaults
  const defaults = {
    user: {
      endpoint: 'auth/user',
      propertyName: 'user',
    },
    login: {
      endpoint: 'auth/login',
    },
    logout: {
      endpoint: 'auth/logout',
      method: 'GET',
    },
    redirect: {
      notLoggedIn: '/login',
      loggedIn: '/'
    },
    token: {
      enabled: true,
      name: 'token',
      cookieName: 'token',
      type: 'Bearer'
    }
  }

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
