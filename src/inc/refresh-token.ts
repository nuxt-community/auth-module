import jwtDecode, { InvalidTokenError, JwtPayload } from 'jwt-decode'
import { addTokenPrefix } from '../utils'
import Storage from '../core/storage'
import RefreshableScheme from '../schemes/RefreshableScheme'
import TokenStatus from './token-status'

export default class RefreshToken {
  public scheme: RefreshableScheme
  public $storage: Storage

  constructor(scheme: RefreshableScheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  _getExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  _setExpiration(expiration: number | false): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration)
  }

  _syncExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  _updateExpiration(refreshToken: string): number | false | void {
    let refreshTokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis =
      Number(this.scheme.options.refreshToken.maxAge) * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      refreshTokenExpiration =
        jwtDecode<JwtPayload>(refreshToken).exp * 1000 || _tokenExpiresAtMillis
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

  _setToken(refreshToken: string | false): string | false {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, refreshToken)
  }

  _syncToken(): string | false {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  get(): string | false {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  set(tokenValue: string | false): string | false {
    const refreshToken = addTokenPrefix(
      tokenValue,
      this.scheme.options.refreshToken.type
    )

    this._setToken(refreshToken)
    this._updateExpiration(refreshToken)

    return refreshToken
  }

  sync(): string | false {
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
}
