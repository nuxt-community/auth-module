import type { AxiosRequestConfig } from 'axios'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import type { Scheme } from '../'
import ExpiredAuthSessionError from './expired-auth-session-error'

export default class RequestHandler {
  public scheme: Scheme
  public axios: NuxtAxiosInstance
  public interceptor: any

  constructor (scheme, axios) {
    this.scheme = scheme
    this.axios = axios
    this.interceptor = null
  }

  _needToken (config: AxiosRequestConfig) {
    const options = this.scheme.options
    return options.token.global || Object.values(options.endpoints)
      .some((endpoint: AxiosRequestConfig | string) => typeof endpoint === 'object' ? endpoint.url === config.url : endpoint === config.url)
  }

  _getUpdatedRequestConfig (config: AxiosRequestConfig, token) {
    config.headers[this.scheme.options.token.name] = token
    return config
  }

  _requestHasAuthorizationHeader (config: AxiosRequestConfig) {
    return !!config.headers.common[this.scheme.options.token.name]
  }

  setHeader (token) {
    if (this.scheme.options.token.global) {
      // Set Authorization token for all axios requests
      this.axios.setHeader(this.scheme.options.token.name, token)
    }
  }

  clearHeader () {
    if (this.scheme.options.token.global) {
      // Clear Authorization token for all axios requests
      this.axios.setHeader(this.scheme.options.token.name, false)
    }
  }

  // ---------------------------------------------------------------
  // Watch requests for token expiration
  // Refresh tokens if token has expired
  // ---------------------------------------------------------------
  initializeRequestInterceptor (refreshEndpoint?: string) {
    this.interceptor = this.axios.interceptors.request.use(async (config) => {
      // Don't intercept refresh token requests
      if (!this._needToken(config) || config.url === refreshEndpoint) {
        return config
      }

      // Perform scheme checks.
      // If token has expired, attempt `tokenCallback`.
      // If refresh token has expired, attempt `refreshTokenCallback`.
      const isValid = await this.scheme.check(true, (isRefreshable) => {
        // Refresh token is not available. Force reset.
        if (!isRefreshable) {
          this.scheme.reset()
          throw new ExpiredAuthSessionError()
        }

        // Refresh token is available. Attempt refresh.
        return this.scheme.refreshTokens().then(() => true).catch(() => {
          // Tokens couldn't be refreshed. Force reset.
          this.scheme.reset()
          throw new ExpiredAuthSessionError()
        })
      }, () => {
        // Refresh token has expired. There is no way to refresh. Force reset.
        this.scheme.reset()
        throw new ExpiredAuthSessionError()
      })

      // Sync token
      const token = this.scheme.token.get()

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

  reset () {
    // Eject request interceptor
    this.axios.interceptors.request.eject(this.interceptor)
    this.interceptor = null
  }
}
