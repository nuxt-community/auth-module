import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import { addTokenPrefix } from './utilities'
import { TokenStatus } from './tokenStatus'

export default class RefreshToken {
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
    const _tokenExpiresAtMillis = _tokenTTLMillis ? _tokenIssuedAtMillis + _tokenTTLMillis : 0

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
    const refreshToken = addTokenPrefix(tokenValue, this.$auth.strategy.options.refreshToken.type)

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

  status () {
    return new TokenStatus(this.get(), this._getExpiration())
  }
}
