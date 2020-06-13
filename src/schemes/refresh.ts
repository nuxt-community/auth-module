import { cleanObj, getResponseProp } from '../utils'
import RefreshController from '../inc/refresh-controller'
import ExpiredAuthSessionError from '../inc/expired-auth-session-error'
import RefreshToken from '../inc/refresh-token'
import type { SchemeCheck } from '../index'
import LocalScheme from './local'

const DEFAULTS = {
  name: 'refresh',
  endpoints: {
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    }
  },
  refreshToken: {
    property: 'refresh_token',
    data: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30,
    required: true,
    prefix: '_refresh_token.',
    expirationPrefix: '_refresh_token_expiration.'
  },
  autoLogout: false
}

export default class RefreshScheme extends LocalScheme {
  public refreshToken: RefreshToken
  public refreshController: RefreshController

  constructor ($auth, options) {
    super($auth, options, DEFAULTS)

    // Initialize Refresh Token instance
    this.refreshToken = new RefreshToken(this, this.$auth.$storage)

    // Initialize Refresh Controller
    this.refreshController = new RefreshController(this)
  }

  _updateTokens (response) {
    const token = getResponseProp(response, this.options.token.property)
    const refreshToken = this.options.refreshToken.required ? getResponseProp(response, this.options.refreshToken.property) : false

    this.token.set(token)

    if (refreshToken) {
      this.refreshToken.set(refreshToken)
    }
  }

  _initializeRequestInterceptor () {
    this.requestHandler.initializeRequestInterceptor(this.options.endpoints.refresh.url)
  }

  check (checkStatus = false): SchemeCheck {
    const response = {
      valid: false,
      tokenExpired: false,
      refreshTokenExpired: false,
      isRefreshable: true
    }

    // Sync tokens
    const token = this.token.sync()
    const refreshToken = this.refreshToken.sync()

    // Token is required but not available
    if (!token) {
      return response
    }

    // Refresh token is required but not available
    if (this.options.refreshToken.required && !refreshToken) {
      return response
    }

    // Check status wasn't enabled, let it pass
    if (!checkStatus) {
      response.valid = true
      return response
    }

    // Get status
    const tokenStatus = this.token.status()
    const refreshTokenStatus = this.refreshToken.status()

    // Refresh token has expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      response.refreshTokenExpired = true
      return response
    }

    // Token has expired, Force reset.
    if (tokenStatus.expired()) {
      response.tokenExpired = true
      return response
    }

    response.valid = true
    return response
  }

  mounted () {
    return super.mounted({
      tokenCallback: () => {
        if (this.options.autoLogout) {
          this.$auth.reset()
        }
      },
      refreshTokenCallback: () => {
        this.$auth.reset()
      }
    })
  }

  async refreshTokens () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) { return }

    // Token and refresh token are required but not available
    if (!this.check().valid) { return }

    // Get refresh token status
    const refreshTokenStatus = this.refreshToken.status()

    // Refresh token is expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      this.$auth.reset()

      throw new ExpiredAuthSessionError()
    }

    const endpoint = {
      data: {
        client_id: undefined,
        grant_type: undefined
      }
    }

    // Add refresh token to payload if required
    if (this.options.refreshToken.required) {
      endpoint.data[this.options.refreshToken.data] = this.refreshToken.get()
    }

    // Add client id to payload if defined
    if (this.options.clientId) {
      endpoint.data.client_id = this.options.clientId
    }

    // Add grant type to payload if defined
    if (this.options.grantType) {
      endpoint.data.grant_type = 'refresh_token'
    }

    cleanObj(endpoint.data)

    // Make refresh request
    return this.$auth.request(
      endpoint,
      this.options.endpoints.refresh
    ).then((response) => {
      // Update tokens
      this._updateTokens(response)
      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'refreshToken' })
      return Promise.reject(error)
    })
  }

  async setUserToken (token, refreshToken?) {
    this.$auth.token.set(token)

    if (refreshToken) {
      this.$auth.refreshToken.set(refreshToken)
    }

    // Fetch user
    return this.fetchUser()
  }

  reset ({ resetInterceptor = true } = {}) {
    this.$auth.setUser(false)
    this.token.reset()
    this.refreshToken.reset()

    if (resetInterceptor) {
      this.requestHandler.reset()
    }
  }
}
