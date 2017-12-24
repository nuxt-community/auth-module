const { resolve } = require('path')
const merge = require('lodash/merge')

module.exports = function (moduleOptions) {
  // Apply defaults
  const defaults = {
    user: {
      endpoint: 'auth/user',
      propertyName: 'user',
      resetOnFail: true,
      enabled: true
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
      type: 'Bearer',
      localStorage: true,
      name: 'token',
      cookie: true,
      cookieName: 'token'
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
