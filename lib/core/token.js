import { addTokenPrefix } from './utilities'
import jwtDecode, { InvalidTokenError } from 'jwt-decode'

export class Token {
  constructor (auth) {
    this.$auth = auth
  }

  _setHeader (token) {
    if (this.$auth.options.globalToken) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.scheme.options.token.name, token)
    }
  }

  _clearHeader () {
    if (this.$auth.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.scheme.options.token.name, false)
    }
  }

  _getExpiration () {
    const _key = this.$auth.options.tokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setExpiration (expiration) {
    const _key = this.$auth.options.tokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.setUniversal(_key, expiration)
  }

  _syncExpiration () {
    const _key = this.$auth.options.tokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  _updateExpiration (token) {
    let tokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = this.$auth.strategy.options.token.maxAge * 1000
    const _tokenExpiresAtMillis = _tokenIssuedAtMillis + _tokenTTLMillis

    try {
      tokenExpiration = jwtDecode(token).exp * 1000 || _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      tokenExpiration = _tokenExpiresAtMillis

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    return this._setExpiration(tokenExpiration || false)
  }

  _setToken (token) {
    const _key = this.$auth.options.token.prefix + this.$auth.strategy.name

    return this.$auth.$storage.setUniversal(_key, token)
  }

  _syncToken () {
    const _key = this.$auth.options.token.prefix + this.$auth.strategy.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  get () {
    const _key = this.$auth.options.token.prefix + this.$auth.strategy.name

    return this.$auth.$storage.getUniversal(_key)
  }

  set (tokenValue) {
    const token = addTokenPrefix(tokenValue, this.$auth.scheme.options.token.type)

    this._setToken(token)
    this._setHeader(token)
    this._updateExpiration(token)

    return token
  }

  sync () {
    const token = this._syncToken()
    this._syncExpiration()
    this._setHeader(token)

    return token
  }

  reset () {
    this._clearHeader()
    this._setToken(false)
    this._setExpiration(false)
  }

  getStatus () {
    return new TokenStatus(this.get(), this._getExpiration)
  }

  refreshAt () {
    return (this._getExpiration() - Date.now()) * 0.75
  }
}

export class RefreshToken {
  constructor (auth) {
    this.$auth = auth
  }

  _getExpiration () {
    const _key = this.$auth.options.refreshTokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setExpiration (expiration) {
    const _key = this.$auth.options.refreshTokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.setUniversal(_key, expiration)
  }

  _syncExpiration () {
    const _key = this.$auth.options.refreshTokenExpiration.prefix + this.$auth.strategy.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  _updateExpiration (refreshToken) {
    let refreshTokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = this.$auth.strategy.options.refreshToken.maxAge * 1000
    const _tokenExpiresAtMillis = _tokenIssuedAtMillis + _tokenTTLMillis

    try {
      refreshTokenExpiration = jwtDecode(refreshToken).exp * 1000 || _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      refreshTokenExpiration = _tokenExpiresAtMillis

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    return this._setExpiration(refreshTokenExpiration || false)
  }

  _setToken (refreshToken) {
    const _key = this.$auth.options.refreshToken.prefix + this.$auth.strategy.name

    return this.$auth.$storage.setUniversal(_key, refreshToken)
  }

  _syncToken () {
    const _key = this.$auth.options.refreshToken.prefix + this.$auth.strategy.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  get () {
    const _key = this.$auth.options.refreshToken.prefix + this.$auth.strategy.name

    return this.$auth.$storage.getUniversal(_key)
  }

  set (tokenValue) {
    const refreshToken = addTokenPrefix(tokenValue, this.$auth.scheme.options.refreshToken.type)

    this._setToken(refreshToken)
    this._updateExpiration(refreshToken)

    return refreshToken
  }

  sync () {
    const refreshToken = this._syncToken()
    this._syncExpiration()

    return refreshToken
  }

  reset () {
    this._setToken(false)
    this._setExpiration(false)
  }

  getStatus () {
    return new TokenStatus(this.get(), this._getExpiration)
  }
}

export class TokenStatus {
  constructor (token, tokenExpiresAt) {
    this.status = this._calculate(token, tokenExpiresAt)
  }

  _calculate (token, tokenExpiresAt) {
    const now = Date.now()

    try {
      if (!token || !tokenExpiresAt) {
        return TokenStatusEnum.UNKNOWN
      }
    } catch (error) {
      return TokenStatusEnum.UNKNOWN
    }

    // Give us some slack to help the token from expiring between validation and usage
    const timeSlackMillis = 500
    tokenExpiresAt -= timeSlackMillis

    // Token is still valid
    if (now < tokenExpiresAt) {
      return TokenStatusEnum.VALID
    }

    return TokenStatusEnum.EXPIRED
  }

  unknown () {
    return TokenStatusEnum.UNKNOWN === this.status
  }

  valid () {
    return TokenStatusEnum.VALID === this.status
  }

  expired () {
    return TokenStatusEnum.EXPIRED === this.status
  }
}

const TokenStatusEnum = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED'
})
