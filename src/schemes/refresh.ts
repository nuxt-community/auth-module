import { cleanObj, getResponseProp } from '../utils'
import RefreshController from '../inc/refresh-controller'
import ExpiredAuthSessionError from '../inc/expired-auth-session-error'
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
    required: true
  },
  autoLogout: false
}

export default class RefreshScheme extends LocalScheme {
  public refreshController: RefreshController

  constructor ($auth, options) {
    super($auth, options, DEFAULTS)

    // Initialize Refresh Controller
    this.refreshController = new RefreshController(this)
  }

  _updateTokens (response) {
    const token = getResponseProp(response, this.options.token.property)
    const refreshToken = this.options.refreshToken.required ? getResponseProp(response, this.options.refreshToken.property) : false

    this.$auth.token.set(token)

    if (refreshToken) {
      this.$auth.refreshToken.set(refreshToken)
    }
  }

  _checkStatus () {
    // Sync tokens
    this.$auth.token.sync()
    this.$auth.refreshToken.sync()

    // Get token and refresh token status
    const tokenStatus = this.$auth.token.status()
    const refreshTokenStatus = this.$auth.refreshToken.status()

    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (refreshTokenStatus.expired()) {
      this.$auth.reset()
    } else if (this.options.autoLogout && tokenStatus.expired()) {
      this.$auth.reset()
    }
  }

  mounted () {
    return super.mounted({ refreshEndpoint: this.options.endpoints.refresh.url })
  }

  check () {
    // Token is required but not available
    if (!this.$auth.token.get()) {
      return false
    }

    // Refresh token is required but not available
    if (this.options.refreshToken.required && !this.$auth.refreshToken.get()) {
      return false
    }

    return true
  }

  async login (endpoint, { refreshEndpoint = this.options.endpoints.refresh.url } = {}) {
    return super.login(endpoint, { refreshEndpoint })
  }

  async refreshTokens () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) { return }

    // Token and refresh token are required but not available
    if (!this.check()) { return }

    // Get refresh token status
    const refreshTokenStatus = this.$auth.refreshToken.status()

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
      endpoint.data[this.options.refreshToken.data] = this.$auth.refreshToken.get()
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

  reset ({ resetInterceptor = true } = {}) {
    this.$auth.setUser(false)
    this.$auth.token.reset()
    this.$auth.refreshToken.reset()

    if (resetInterceptor) {
      this.requestHandler.reset()
    }
  }
}
