import jwtDecode, { InvalidTokenError, JwtPayload } from 'jwt-decode'
import { addTokenPrefix } from '../utils'
import Storage from '../core/storage'
import TokenableScheme from '../schemes/TokenableScheme'
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

    return this.$storage.getUniversal(_key)
  }

  set(tokenValue: string | boolean): string | boolean {
    const token = addTokenPrefix(tokenValue, this.scheme.options.token.type)

    this.setToken(token)
    this.scheme.requestHandler.setHeader(token)
    this.updateExpiration(token)

    return token
  }

  sync(): string | boolean {
    const token = this.syncToken()
    this.syncExpiration()
    this.scheme.requestHandler.setHeader(token)

    return token
  }

  reset(): void {
    this.scheme.requestHandler.clearHeader()
    this.setToken(false)
    this.setExpiration(false)
  }

  status(): TokenStatus {
    return new TokenStatus(this.get(), this.getExpiration())
  }

  private getExpiration(): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.getUniversal(_key)
  }

  private setExpiration(expiration: number | false): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.setUniversal(_key, expiration)
  }

  private syncExpiration(): number | false {
    const _key = this.scheme.options.token.expirationPrefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }

  private updateExpiration(token: string): number | false | void {
    let tokenExpiration
    const _tokenIssuedAtMillis = Date.now()
    const _tokenTTLMillis = Number(this.scheme.options.token.maxAge) * 1000
    const _tokenExpiresAtMillis = _tokenTTLMillis
      ? _tokenIssuedAtMillis + _tokenTTLMillis
      : 0

    try {
      tokenExpiration =
        jwtDecode<JwtPayload>(token).exp * 1000 || _tokenExpiresAtMillis
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it, use _tokenExpiresAt value
      tokenExpiration = _tokenExpiresAtMillis

      if (!(error instanceof InvalidTokenError)) {
        throw error
      }
    }

    // Set token expiration
    return this.setExpiration(tokenExpiration || false)
  }

  private setToken(token: string | boolean): string | boolean {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.setUniversal(_key, token)
  }

  private syncToken(): string | boolean {
    const _key = this.scheme.options.token.prefix + this.scheme.name

    return this.$storage.syncUniversal(_key)
  }
}
