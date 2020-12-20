import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import type { TokenableScheme, RefreshableScheme, HTTPRequest } from '../types'
import { ExpiredAuthSessionError } from './expired-auth-session-error'

export class RequestHandler {
  public scheme: TokenableScheme | RefreshableScheme
  public axios: NuxtAxiosInstance
  public interceptor: number

  constructor(
    scheme: TokenableScheme | RefreshableScheme,
    axios: NuxtAxiosInstance
  ) {
    this.scheme = scheme
    this.axios = axios
    this.interceptor = null
  }

  setHeader(token: string): void {
    if (this.scheme.options.token.global) {
      // Set Authorization token for all axios requests
      this.axios.setHeader(this.scheme.options.token.name, token)
    }
  }

  clearHeader(): void {
    if (this.scheme.options.token.global) {
      // Clear Authorization token for all axios requests
      this.axios.setHeader(this.scheme.options.token.name, false)
    }
  }

  // ---------------------------------------------------------------
  initializeRequestInterceptor(refreshEndpoint?: string): void {
    this.interceptor = this.axios.interceptors.request.use(async (config) => {
      // Don't intercept refresh token requests
      if (!this._needToken(config) || config.url === refreshEndpoint) {
        return config
      }

      // Perform scheme checks.
      const {
        valid,
        tokenExpired,
        refreshTokenExpired,
        isRefreshable
      } = this.scheme.check(true)
      let isValid = valid

      // Refresh token has expired. There is no way to refresh. Force reset.
      if (refreshTokenExpired) {
        this.scheme.reset()
        throw new ExpiredAuthSessionError()
      }

      // Token has expired.
      if (tokenExpired) {
        // Refresh token is not available. Force reset.
        if (!isRefreshable) {
          this.scheme.reset()
          throw new ExpiredAuthSessionError()
        }

        // Refresh token is available. Attempt refresh.
        isValid = await (this.scheme as RefreshableScheme)
          .refreshTokens()
          .then(() => true)
          .catch(() => {
            // Tokens couldn't be refreshed. Force reset.
            this.scheme.reset()
            throw new ExpiredAuthSessionError()
          })
      }

      // Sync token
      const token = this.scheme.token.get()

      // Scheme checks were performed, but returned that is not valid.
      if (!isValid) {
        // The authorization header in the current request is expired.
        // Token was deleted right before this request
        if (!token && this._requestHasAuthorizationHeader(config)) {
          throw new ExpiredAuthSessionError()
        }

        return config
      }

      // Token is valid, let the request pass
      // Fetch updated token and add to current request
      return this._getUpdatedRequestConfig(config, token)
    })
  }

  reset(): void {
    // Eject request interceptor
    this.axios.interceptors.request.eject(this.interceptor)
    this.interceptor = null
  }

  private _needToken(config): boolean {
    const options = this.scheme.options
    return (
      options.token.global ||
      Object.values(options.endpoints).some((endpoint: HTTPRequest | string) =>
        typeof endpoint === 'object'
          ? endpoint.url === config.url
          : endpoint === config.url
      )
    )
  }

  // ---------------------------------------------------------------
  // Watch requests for token expiration
  // Refresh tokens if token has expired

  private _getUpdatedRequestConfig(config, token: string | boolean) {
    if (typeof token === 'string') {
      config.headers[this.scheme.options.token.name] = token
    }

    return config
  }

  private _requestHasAuthorizationHeader(config): boolean {
    return !!config.headers.common[this.scheme.options.token.name]
  }
}
