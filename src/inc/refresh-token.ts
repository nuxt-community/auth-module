import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
import type { RefreshableScheme } from '../types'
import type { Storage } from '../core'
import { addTokenPrefix } from '../utils'
import { TokenStatus } from './token-status'

export class RefreshToken {
  public scheme: RefreshableScheme
  public $storage: Storage

  constructor(scheme: RefreshableScheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  get(): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.getUniversal(_key) as string | boolean
  }

  set(tokenValue: string | boolean): string | boolean {
    const refreshToken = addTokenPrefix(
      tokenValue,
      this.scheme.options.refreshToken.type
    )

    this._setToken(refreshToken)
    this._updateExpiration(refreshToken)

    return refreshToken
  }

  sync(): string | boolean {
    const refreshToken = this._syncToken()
    this._syncExpiration()

    return refreshToken
  }

  reset(): void {
    this._setToken(false)
    this._setExpiration(false)
  }

  status(): TokenStatus {
    return new TokenStatus(this.get(), this._getExpiration())
  }

  private _getExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key) as number | false
  }

  private _setExpiration(expiration: number | false): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration) as number | false
  }

  private _syncExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as number | false
  }

  private _updateExpiration(
    refreshToken: string | boolean
  ): number | false | void {
    let refreshTokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis =
      Number(this.scheme.options.refreshToken.maxAge) * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      refreshTokenExpiration =
        jwtDecode<JwtPayload>(refreshToken + '').exp * 1000 ||
        _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      refreshTokenExpiration = _tokenExpiresAtMillis

      if (!((error && error.name === 'InvalidTokenError') /* jwtDecode */)) {
        throw error
      }
    }

    // Set token expiration
    return this._setExpiration(refreshTokenExpiration || false)
  }

  private _setToken(refreshToken: string | boolean): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, refreshToken) as string | boolean
  }

  private _syncToken(): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as string | boolean
  }
}
