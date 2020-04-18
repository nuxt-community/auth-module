import ExpiredAuthSessionError from './includes/ExpiredAuthSessionError'

export default class RefreshController {
  constructor (scheme) {
    this.scheme = scheme
    this.$auth = scheme.$auth
    this._refreshPromise = null
    this._refreshInterval = undefined
  }

  _getUpdatedRequestConfig (config) {
    config.headers[this.scheme.options.token.name] = this.$auth.token.get()
    return config
  }

  _requestHasAuthorizationHeader (config) {
    return !!config.headers.common[this.scheme.options.token.name]
  }

  _doRefresh () {
    this._refreshPromise = new Promise((resolve) => {
      this.scheme.refreshTokens().then((response) => {
        this._refreshPromise = null
        resolve(response)
      })
    })

    return this._refreshPromise
  }

  // Returns a promise which is resolved when refresh is completed
  // Call this function when you intercept a request with an expired token.
  // Multiple requests will be queued until the first has completed token refresh.
  handleRefresh () {
    // Another request has started refreshing the token, wait for it to complete
    if (this._refreshPromise) {
      return this._refreshPromise
    }

    return this._doRefresh()
  }

  // ---------------------------------------------------------------
  // Refreshes token on set intervals
  // Token is refreshed at 75% of the token expiration
  // Call this function once from your mounted hook, client side
  // ---------------------------------------------------------------
  initializeScheduledRefresh () {
    // If is server side, bail
    if (process.server) { return }

    let intervalDurationMillis = this.$auth.token.refreshIn()
    if (intervalDurationMillis < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDurationMillis = 1000
    }

    this._refreshInterval = setInterval(() => {
      this.handleRefresh()
    }, intervalDurationMillis)
  }

  // ---------------------------------------------------------------
  // Watch requests for token expiration
  // Refresh tokens if token has expired
  // ---------------------------------------------------------------
  initializeRequestInterceptor (refreshEndpoint) {
    this.$auth.ctx.app.$axios.onRequest(async (config) => {
      // Don't intercept refresh token requests
      if (config.url === refreshEndpoint) {
        return config
      }

      // Sync tokens
      const token = this.$auth.token.sync()
      const refreshToken = this.$auth.refreshToken.sync()
      const tokenStatus = this.$auth.token.status()
      const refreshTokenStatus = this.$auth.refreshToken.status()

      // If no token or no refresh token, bail
      if (!token || !refreshToken) {
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
        await this.$auth.reset()

        throw new ExpiredAuthSessionError()
      }

      // Refresh token before sending current request
      await this.handleRefresh()

      // Fetch updated token and add to current request
      return this._getUpdatedRequestConfig(config)
    })
  }

  reset () {
    clearInterval(this._refreshInterval)
  }
}
