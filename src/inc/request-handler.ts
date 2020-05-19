import type { Auth, HTTPRequest } from '../'
import ExpiredAuthSessionError from './expired-auth-session-error'

export default class RequestHandler {
  public $auth: Auth
  public interceptor: any

  constructor (auth: Auth) {
    this.$auth = auth
    this.interceptor = null
  }

  _getUpdatedRequestConfig (config: HTTPRequest) {
    config.headers[this.$auth.strategy.options.token.name] = this.$auth.token.get()
    return config
  }

  _requestHasAuthorizationHeader (config: HTTPRequest) {
    return !!config.headers.common[this.$auth.strategy.options.token.name]
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

  // ---------------------------------------------------------------
  // Watch requests for token expiration
  // Refresh tokens if token has expired
  // ---------------------------------------------------------------
  initializeRequestInterceptor (refreshEndpoint?: string) {
    this.interceptor = this.$auth.ctx.app.$axios.interceptors.request.use(async (config) => {
      // Don't intercept refresh token requests
      if (config.url === refreshEndpoint) {
        return config
      }

      // Sync tokens
      const token = this.$auth.token.sync()
      this.$auth.refreshToken.sync()

      // Get status
      const tokenStatus = this.$auth.token.status()
      const refreshTokenStatus = this.$auth.refreshToken.status()

      // If no token or no refresh token, bail
      if (!this.$auth.strategy.check()) {
        // The authorization header in the current request is expired.
        // Token was deleted right before this request
        if (!token && this._requestHasAuthorizationHeader(config)) {
          throw new ExpiredAuthSessionError()
        }

        return config
      }

      // Token is still valid, let the request pass
      if (tokenStatus.valid() || tokenStatus.unknown()) {
        return this._getUpdatedRequestConfig(config)
      }

      // Refresh token has also expired. There is no way to refresh. Force reset.
      if (refreshTokenStatus.expired()) {
        this.$auth.reset()

        throw new ExpiredAuthSessionError()
      }

      // Refresh token before sending current request
      await this.$auth.refreshTokens().catch(() => {
        // Tokens couldn't be refreshed. Force reset.
        this.$auth.reset()
        throw new ExpiredAuthSessionError()
      })

      // Fetch updated token and add to current request
      return this._getUpdatedRequestConfig(config)
    })
  }

  reset () {
    // Eject request interceptor
    this.$auth.ctx.app.$axios.interceptors.request.eject(this.interceptor)
    this.interceptor = null
  }
}
