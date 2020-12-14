import jwtDecode, { InvalidTokenError, JwtPayload } from 'jwt-decode'
import TokenableScheme from 'src/schemes/TokenableScheme'
import { addTokenPrefix } from 'src/utils'
import Storage from 'src/core/storage'
import TokenStatus from './token-status'

export default class Token {
  public scheme: TokenableScheme
  public $storage: Storage

  constructor(scheme: TokenableScheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
  }

  get(): string | boolean {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.getUniversal(_key) as string | boolean
  }

  set(tokenValue: string | boolean): string | boolean {
    const token = addTokenPrefix(tokenValue, this.scheme.options.token.type)

    this._setToken(token)
    this.scheme.requestHandler.setHeader(token)
    this._updateExpiration(token)

    return token
  }

  sync(): string | boolean {
    const token = this._syncToken()
    this._syncExpiration()
    this.scheme.requestHandler.setHeader(token)

    return token
  }

  reset(): void {
    this.scheme.requestHandler.clearHeader()
    this._setToken(false)
    this._setExpiration(false)
  }

  status(): TokenStatus {
    return new TokenStatus(this.get(), this._getExpiration())
  }

  private _getExpiration(): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key) as number | false
  }

  private _setExpiration(expiration: number | false): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration) as number | false
  }

  private _syncExpiration(): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as number | false
  }

  private _updateExpiration(token: string | boolean): number | false | void {
    let tokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = Number(this.scheme.options.token.maxAge) * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      tokenExpiration =
        jwtDecode<JwtPayload>(token + '').exp * 1000 || _tokenExpiresAtMillis
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

  private _setToken(token: string | boolean): string | boolean {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, token) as string | boolean
  }

  private _syncToken(): string | boolean {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key) as string | boolean
  }
}
