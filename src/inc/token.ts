import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import { addTokenPrefix } from '../utils'
import { Scheme } from '../index'
import Storage from '../core/storage'
import TokenStatus from './token-status'

export default class Token {
  public scheme: Scheme
  public $storage: Storage

  constructor (scheme: Scheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  _getExpiration () {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  _setExpiration (expiration) {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration)
  }

  _syncExpiration () {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  _updateExpiration (token) {
    let tokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = this.scheme.options.token.maxAge * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis ? _tokenIssuedAtMillis + _tokenTTLMillis : 0

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
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, token)
  }

  _syncToken () {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  get () {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  set (tokenValue) {
    const token = addTokenPrefix(tokenValue, this.scheme.options.token.type)

    this._setToken(token)
    this.scheme.requestHandler.setHeader(token)
    this._updateExpiration(token)

    return token
  }

  sync () {
    const token = this._syncToken()
    this._syncExpiration()
    this.scheme.requestHandler.setHeader(token)

    return token
  }

  reset () {
    this.scheme.requestHandler.clearHeader()
    this._setToken(false)
    this._setExpiration(false)
  }

  status () {
    return new TokenStatus(this.get(), this._getExpiration())
  }
}
