import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import { getProp } from 'lib/core/utilities'

export class RefreshController {
  constructor (scheme) {
    this.scheme = scheme
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
      // Sync tokens
      this.$scheme._setToken(this.$scheme.$auth.syncToken(this.$scheme.name))
      this.$scheme.$auth.syncRefreshToken(this.$scheme.name)

      this.$scheme._refreshToken().then(response => {
        this.reset()
        this.scheduleTokenRefresh()
        this.refreshPromise = null
        resolve(response)
      })
    })

    return this.refreshPromise
  }

  // Schedule token refresh at 75% of the token expiration
  scheduleTokenRefresh () {
    // If auto refresh is disabled, bail
    if (!this.$scheme.options.autoRefresh.enable) return

    let intervalDuration = (this.$scheme._getTokenExpiration() - Date.now()) * 0.75
    if (intervalDuration < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDuration = 1000
    }

    this.refreshInterval = setInterval(() => {
      this.handleRefresh()
    }, intervalDuration)
  }

  reset () {
    clearInterval(this.refreshInterval)
  }

  getUpdatedRequestConfig (config) {
    config.headers[this.$scheme.options.tokenName] = this.$scheme.$auth.getToken(this.$scheme.name)
    return config
  }

  requestHasAuthorizationHeader (config) {
    return !!config.headers.common[this.$scheme.options.tokenName]
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
