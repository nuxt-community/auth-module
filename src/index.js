const { resolve } = require('path')

export default async function module (moduleOptions) {
  // Apply defaults
  const defaults = {
    login: {
      endpoint: 'auth/login',
      propertyName: 'token',
      session: false
    },
    logout: {
      endpoint: 'auth/logout',
      method: 'GET',
      paramTokenName: '',
      appendToken: false
    },
    user: {
      endpoint: 'auth/user',
      propertyName: 'user',
      paramTokenName: '',
      appendToken: false
    },
    tokenType: 'Bearer'
  }

  const options = Object.assign({}, this.options.auth, moduleOptions, defaults)

  // Plugin
  this.addPlugin({ src: resolve(__dirname, '../templates/auth.plugin.js'), fileName: 'auth.plugin.js' })

  // Middleware
  this.addTemplate({ src: resolve(__dirname, '../templates/auth.middleware.js'), fileName: 'auth.middleware.js' })

  // Store
  this.addTemplate({ src: resolve(__dirname, '../templates/auth.store.js'), fileName: 'auth.store.js', options })
}
