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

  get(): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  set(tokenValue: string | boolean): string | boolean {
    const refreshToken = addTokenPrefix(
      tokenValue,
      this.scheme.options.refreshToken.type
    )

    this.setToken(refreshToken)
    this.updateExpiration(refreshToken)

    return refreshToken
  }

  sync(): string | boolean {
    const refreshToken = this.syncToken()
    this.syncExpiration()

    return refreshToken
  }

  reset(): void {
    this.setToken(false)
    this.setExpiration(false)
  }

  status(): TokenStatus {
    return new TokenStatus(this.get(), this.getExpiration())
  }

  private getExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  private setExpiration(expiration: number | false): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration)
  }

  private syncExpiration(): number | false {
    const _key =
      this.scheme.options.refreshToken.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  private updateExpiration(refreshToken: string): number | false | void {
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
    return this.setExpiration(refreshTokenExpiration || false)
  }

  private setToken(refreshToken: string | boolean): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, refreshToken)
  }

  private syncToken(): string | boolean {
    const _key = this.scheme.options.refreshToken.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }
}
