// @ts-ignore
import jwtDecode, { InvalidTokenError } from 'jwt-decode'
import Storage from '../core/storage'
import { addTokenPrefix } from '../utils'
import TokenStatus from './token-status'
import type { Scheme } from '..'

export default class IdToken {
  public scheme: Scheme
  public $storage: Storage

  constructor (scheme: Scheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  _getExpiration () {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  _setExpiration (expiration: number | boolean) {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration)
  }

  _syncExpiration () {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  _updateExpiration (idToken: any) {
    let idTokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = this.scheme.options.idToken.maxAge * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      idTokenExpiration = jwtDecode(idToken).exp * 1000 || _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      idTokenExpiration = _tokenExpiresAtMillis

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    return this._setExpiration(idTokenExpiration || false)
  }

  _setToken (idToken: boolean) {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, idToken)
  }

  _syncToken () {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  get () {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  set (tokenValue: any) {
    const idToken = addTokenPrefix(tokenValue, this.scheme.options.idToken.type)

    this._setToken(idToken)
    this._updateExpiration(idToken)

    return idToken
  }

  sync () {
    const idToken = this._syncToken()
    this._syncExpiration()

    return idToken
  }

  reset () {
    this._setToken(false)
    this._setExpiration(false)
  }

  status () {
    return new TokenStatus(this.get(), this._getExpiration())
  }
}
