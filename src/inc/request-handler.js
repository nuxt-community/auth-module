import ExpiredAuthSessionError from './expired-auth-session-error'

export default class RequestHandler {
  constructor (auth) {
    this.$auth = auth
  }

  _getUpdatedRequestConfig (config) {
    config.headers[this.$auth.strategy.options.token.name] = this.$auth.token.get()
    return config
  }

  setHeader (token) {
    if (this.$auth.strategy.options.token.global) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, token)
    }
  }

  clearHeader () {
    if (this.$auth.strategy.options.token.global) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, false)
    }
  }

  initializeRequestInterceptor () {
    this.$auth.ctx.app.$axios.onRequest(async (config) => {
      // Sync token
      const token = this.$auth.token.sync()

      // Get status
      const tokenStatus = this.$auth.token.status()

      // If no token, bail
      if (!token) {
        return config
      }

      // Token has expired. Force reset.
      if (tokenStatus.expired()) {
        await this.$auth.reset()

        throw new ExpiredAuthSessionError()
      }

      // Token is still valid. Fetch updated token and add to current request
      return this._getUpdatedRequestConfig(config)
    })
  }
}
