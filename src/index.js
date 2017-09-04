const { resolve } = require('path')

export default async function module (moduleOptions) {
  // const options = Object.assign({}, this.options.auth, moduleOptions)

  // Plugin
  this.addPlugin({ src: resolve(__dirname, '../templates/auth.plugin.js'), fileName: 'auth.plugin.js' })

  // Middleware
  this.addTemplate({ src: resolve(__dirname, '../templates/auth.middleware.js'), fileName: 'auth.middleware.js' })

  // Store
  this.addTemplate({ src: resolve(__dirname, '../templates/auth.store.js'), fileName: 'auth.store.js' })
}
