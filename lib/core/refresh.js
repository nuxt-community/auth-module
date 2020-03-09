import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import { getProp } from './utilities'
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
      this.scheme._refreshToken().then(response => {
        this.refreshPromise = null
        resolve(response)
      })
    })

    return this.refreshPromise
  }

  initializeAutomaticRefresh () {
    // If auto refresh is enabled, schedule token refresh
    if (this.scheme.options.autoRefresh.enable) {
      this.initializeScheduledRefresh()
    }

    this.initializeRequestInterceptor()
  }

  // ---------------------------------------------------------------
  // Refreshes token on set intervals
  // Token is refreshed at 75% of the token expiration
  // Call this function once from your mounted hook, client side
  // ---------------------------------------------------------------
  initializeScheduledRefresh () {
    let intervalDuration = (this.scheme._getTokenExpiration() - Date.now()) * 0.75
    if (intervalDuration < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDuration = 1000
    }

    this.refreshInterval = setInterval(() => {
      this.handleRefresh()
    }, intervalDuration)
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
      const token = this.$auth.syncToken(this.scheme.name) || false
      const refreshToken = this.$auth.syncRefreshToken(this.scheme.name)
      this.scheme._setToken(token)
      this.scheme._syncTokenExpiration()
      this.scheme._syncRefreshTokenExpiration()

      // If no token or no refresh token, bail
      if (!token || !refreshToken) {
        // The authorization header in the current request is expired.
        // Token was deleted right before this request
        if (!token && this.requestHasAuthorizationHeader(config)) {
          throw new ExpiredAuthSessionError()
        }

        return this.getUpdatedRequestConfig(config)
      }

      // Sync token expiration status
      this.scheme.tokenStatus.syncStatus()

      // Token is still valid, let the request pass
      if (this.scheme.tokenStatus.valid() || this.scheme.tokenStatus.unknown()) {
        return this.getUpdatedRequestConfig(config)
      }

      // Refresh token has also expired. There is no way to refresh. Force reset.
      if (this.scheme.tokenStatus.refreshExpired()) {
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
    config.headers[this.scheme.options.tokenName] = this.$auth.getToken(this.scheme.name)
    return config
  }

  requestHasAuthorizationHeader (config) {
    return !!config.headers.common[this.scheme.options.tokenName]
  }
}

const TokenExpirationStatusEnum = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  REFRESH_EXPIRED: 'REFRESH_EXPIRED'
})

export class TokenExpirationStatus {
  constructor (scheme) {
    this.$scheme = scheme
  }

  _calculateTokenStatus () {
    const now = Date.now()
    let tokenExpiresAt, refreshTokenExpiresAt

    try {
      tokenExpiresAt = this.$scheme._getTokenExpiration()
      refreshTokenExpiresAt = this.$scheme._getRefreshTokenExpiration()

      if (!tokenExpiresAt) {
        return TokenExpirationStatusEnum.UNKNOWN
      }
    } catch (error) {
      return TokenExpirationStatusEnum.UNKNOWN
    }

    // Give us some slack to help the token from expiring between validation and usage
    const timeSlackMillis = 500
    tokenExpiresAt -= timeSlackMillis
    refreshTokenExpiresAt -= timeSlackMillis

    // Token is still valid
    if (now < tokenExpiresAt) {
      return TokenExpirationStatusEnum.VALID
    }

    if (now > refreshTokenExpiresAt) {
      return TokenExpirationStatusEnum.REFRESH_EXPIRED
    }

    return TokenExpirationStatusEnum.EXPIRED
  }

  setTokenExpiration (result = {}) {
    const token = this.$scheme.$auth.getToken(this.$scheme.name)
    let decodedToken, tokenExpiration
    const _tokenIssuedAt = getProp(result, this.$scheme.options.issuedAt) || Date.now()
    const _tokenTTL = getProp(result, this.$scheme.options.expiresIn) || this.$scheme.options.token.maxAge
    const _tokenExpiresAt = getProp(result, this.$scheme.options.expiresAt) * 1000 || _tokenIssuedAt + (_tokenTTL * 1000)

    try {
      decodedToken = jwtDecode(token)
      tokenExpiration = decodedToken.exp * 1000
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      tokenExpiration = _tokenExpiresAt || false

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    this.$scheme._setTokenExpiration(tokenExpiration)

    // Update status
    this.syncStatus()

    return tokenExpiration
  }

  setRefreshTokenExpiration () {
    const refreshToken = this.$scheme.$auth.getRefreshToken(this.$scheme.name)
    let decodedToken, refreshTokenExpiration
    const _tokenIssuedAt = Date.now()
    const _tokenTTL = this.$scheme.options.refreshToken.maxAge
    const _tokenExpiresAt = _tokenIssuedAt + (_tokenTTL * 1000)

    try {
      decodedToken = jwtDecode(refreshToken)
      refreshTokenExpiration = decodedToken.exp * 1000
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      refreshTokenExpiration = _tokenExpiresAt || false

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    this.$scheme._setRefreshTokenExpiration(refreshTokenExpiration)

    // Update status
    this.syncStatus()

    return refreshTokenExpiration
  }

  syncStatus () {
    this.status = this._calculateTokenStatus()
  }

  unknown () {
    return TokenExpirationStatusEnum.UNKNOWN === this.status
  }

  valid () {
    return TokenExpirationStatusEnum.VALID === this.status
  }

  expired () {
    return TokenExpirationStatusEnum.EXPIRED === this.status
  }

  refreshExpired () {
    return TokenExpirationStatusEnum.REFRESH_EXPIRED === this.status
  }
}
