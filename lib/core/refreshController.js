import ExpiredAuthSessionError from './includes/ExpiredAuthSessionError'

export class RefreshController {
  constructor (scheme) {
    this.scheme = scheme
    this.$auth = scheme.$auth
    this.refreshPromise = null
    this.refreshInterval = undefined
  }

  // Returns a promise which is resolved when refresh is completed
  // Call this function when you intercept a request with an expired token.
  // Multiple requests will be queued until the first has completed token refresh.
  handleRefresh () {
    // Another request has started refreshing the token, wait for it to complete
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    return this._doRefresh()
  }

  _doRefresh () {
    this.refreshPromise = new Promise(resolve => {
      this.scheme.refreshToken().then(response => {
        this.refreshPromise = null
        resolve(response)
      })
    })

    return this.refreshPromise
  }

  // ---------------------------------------------------------------
  // Refreshes token on set intervals
  // Token is refreshed at 75% of the token expiration
  // Call this function once from your mounted hook, client side
  // ---------------------------------------------------------------
  initializeScheduledRefresh () {
    // If is server side, bail
    if (process.server) return

    let intervalDurationMillis = this.$auth.refreshTokenIn()
    if (intervalDurationMillis < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDurationMillis = 1000
    }

    this.refreshInterval = setInterval(() => {
      this.handleRefresh()
    }, intervalDurationMillis)
  }

  // ---------------------------------------------------------------
  // Watch requests for token expiration
  // Refresh tokens if token has expired
  // ---------------------------------------------------------------
  initializeRequestInterceptor (refreshEndpoint) {
    this.$auth.ctx.app.$axios.onRequest(async config => {
      // Don't intercept refresh token requests
      if (config.url === refreshEndpoint) {
        return config
      }

      // Sync tokens
      const token = this.$auth.syncToken()
      const refreshToken = this.$auth.syncRefreshToken()
      const tokenStatus = this.$auth.getTokenStatus()
      const refreshTokenStatus = this.$auth.getRefreshTokenStatus()

      // If no token or no refresh token, bail
      if (!token || !refreshToken) {
        // The authorization header in the current request is expired.
        // Token was deleted right before this request
        if (!token && this.requestHasAuthorizationHeader(config)) {
          throw new ExpiredAuthSessionError()
        }

        return this.getUpdatedRequestConfig(config)
      }

      // Token is still valid, let the request pass
      if (tokenStatus.valid() || tokenStatus.unknown()) {
        return this.getUpdatedRequestConfig(config)
      }

      // Refresh token has also expired. There is no way to refresh. Force reset.
      if (refreshTokenStatus.expired()) {
        await this.$auth.reset()

        throw new ExpiredAuthSessionError()
      }

      // Refresh token before sending current request
      await this.handleRefresh()

      // Fetch updated token and add to current request
      return this.getUpdatedRequestConfig(config)
    })
  }

  reset () {
    clearInterval(this.refreshInterval)
  }

  getUpdatedRequestConfig (config) {
    config.headers[this.scheme.options.token.name] = this.$auth.getToken()
    return config
  }

  requestHasAuthorizationHeader (config) {
    return !!config.headers.common[this.scheme.options.token.name]
  }
}
