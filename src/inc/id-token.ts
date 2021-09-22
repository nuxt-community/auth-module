// @ts-ignore
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { addTokenPrefix } from '../utils'
import type { IdTokenableScheme } from '..'
import type { Storage } from '../core'
import { TokenStatus } from './token-status'

export class IdToken {
  public scheme: IdTokenableScheme
  public $storage: Storage

  constructor(scheme: IdTokenableScheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  get(): string | boolean {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.getUniversal(_key) as string | boolean
  }

  set(tokenValue: string | boolean): string | boolean {
    const idToken = addTokenPrefix(tokenValue, this.scheme.options.idToken.type)

    this._setToken(idToken)
    this._updateExpiration(idToken)

    return idToken
  }

  sync(): string | boolean {
    const idToken = this._syncToken()
    this._syncExpiration()

    return idToken
  }

  reset() {
    this._setToken(false)
    this._setExpiration(false)
  }

  status(): TokenStatus {
    return new TokenStatus(this.get(), this._getExpiration())
  }

  private _getExpiration(): number | false {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key) as number | false
  }

  private _setExpiration(expiration: number | false): number | false {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration) as number | false
  }

  private _syncExpiration(): number | false {
    const _key = this.scheme.options.idToken.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as number | false
  }

  private _updateExpiration(idToken: string | boolean): number | false | void {
    let idTokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = Number(this.scheme.options.idToken.maxAge) * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      idTokenExpiration =
        jwtDecode<JwtPayload>(idToken + '').exp * 1000 || _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      idTokenExpiration = _tokenExpiresAtMillis

      if (!(error && error.name === 'InvalidTokenError')) {
        throw error
      }
    }

    // Set token expiration
    return this._setExpiration(idTokenExpiration || false)
  }

  private _setToken(idToken: string | boolean): string | boolean {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, idToken) as string | boolean
  }

  private _syncToken(): string | boolean {
    const _key = this.scheme.options.idToken.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as string | boolean
  }

  userInfo() {
    const idToken = this.get()
    if (typeof idToken === 'string') {
      return jwtDecode(idToken)
    }
  }
}
