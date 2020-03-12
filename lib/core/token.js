import { addTokenPrefix } from './utilities'
import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import { TokenStatus } from './tokenStatus'

export class Token {
  constructor (auth) {
    this.$auth = auth
  }

  _setHeader (token) {
    if (this.$auth.strategy.options.token.global) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, token)
    }
  }

  _clearHeader () {
    if (this.$auth.strategy.options.token.global) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, false)
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
    const token = addTokenPrefix(tokenValue, this.$auth.strategy.options.token.type)

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
    return new TokenStatus(this.get(), this._getExpiration())
  }

  refreshAt () {
    return (this._getExpiration() - Date.now()) * 0.75
  }
}
