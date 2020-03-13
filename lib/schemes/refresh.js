import defu from 'defu'
import LocalScheme from './local'
import { getProp, addTokenPrefix } from '../utilities'
import { TokenExpirationStatus, RefreshController } from '../refresh'
import ExpiredAuthSessionError from '../includes/ExpiredAuthSessionError'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))

    // Initialize Token Expiration Status and Refresh Controller
    this.tokenStatus = new TokenExpirationStatus(this)
    this.refreshController = new RefreshController(this)
  }

  async _updateTokens (result) {
    const token = addTokenPrefix(getProp(result, this.options.token.property), this.options.tokenType)
    const refreshToken = getProp(result, this.options.refreshToken.property)

    // Update access token
    this.$auth.setToken(this.name, token)
    super._setToken(token)

    // Update token expiration
    this.tokenStatus.updateTokenExpiration(result)

    // Update refresh token and register refresh-logic
    if (refreshToken) {
      const hasRefreshTokenChanged = refreshToken !== this.$auth.getRefreshToken(this.name)
      this.$auth.setRefreshToken(this.name, refreshToken)

      // Update refresh token expiration
      if (this.options.refreshToken.maxAge) {
        if (!this.tokenStatus.getRefreshTokenExpiration() || hasRefreshTokenChanged) {
          this.tokenStatus.updateRefreshTokenExpiration()
        }
      }
    }

    // Update client id
    const clientId = getProp(result, this.options.clientId)
    if (clientId) {
      this._setClientId(clientId)
    }
  }

  async _refreshToken () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) return

    // Token and Refresh Token are required but not available
    if (!this.$auth.getToken(this.name) || !this.$auth.getRefreshToken(this.name)) return

    this.tokenStatus.syncStatus()

    // Refresh token is expired. There is no way to refresh. Force reset.
    if (this.tokenStatus.refreshExpired()) {
      await this.$auth.reset()

      throw new ExpiredAuthSessionError()
    }

    const { dataClientId, dataGrantType, grantType } = this.options
    const endpoint = {
      data: {
        [this.options.dataRefreshToken]: this.$auth.getRefreshToken(this.name)
      }
    }

    // Only add client id to payload if enabled
    if (dataClientId) {
      endpoint.data[dataClientId] = this._getClientId()
    }

    // Only add grant type to payload if enabled
    if (dataGrantType) {
      endpoint.data[dataGrantType] = grantType
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.refresh,
      true
    ).then(({ response, result }) => {
      this._updateTokens(result)
      return response
    }).catch(error => {
      this.$auth.callOnError(error, { method: 'refreshToken' })
    })
  }

  async mounted () {
    const token = this.$auth.syncToken(this.name)
    this.$auth.syncRefreshToken(this.name)
    this._setToken(token)
    this.tokenStatus.syncTokenExpiration()
    this.tokenStatus.syncRefreshTokenExpiration()
    this._syncClientId()

    if (this.tokenStatus.refreshExpired()) {
      await this.$auth.reset()
    } else if (this.options.autoLogout && this.tokenStatus.expired()) {
      await this.$auth.reset()
    }

    // Initialize request interceptor
    this.refreshController.initializeRequestInterceptor(this.options.endpoints.refresh.url)

    return this.$auth.fetchUserOnce().then(() => {
      // Only refresh token if user is logged in and is client side
      if (process.client && this.$auth.loggedIn && this.options.autoRefresh) {
        this.refreshController.handleRefresh()
          // Initialize scheduled refresh
          .then(() => this.refreshController.initializeScheduledRefresh())
      }
    })
  }

  async login (endpoint) {
    // Login endpoint is disabled
    if (!this.options.endpoints.login) return

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // Make login request
    const { response, result } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    this._updateTokens(result)

    if (this.options.autoRefresh) {
      this.refreshController.initializeScheduledRefresh()
    }

    if (this.options.autoFetchUser) {
      await this.fetchUser()
    }

    return response
  }

  async fetchUser (endpoint) {
    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Token is required but not available
    if (!this.$auth.getToken(this.name)) return

    let requestFailed = false

    // Try to fetch user and then set
    let user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).catch(error => {
      requestFailed = true
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })

    // If the request has not failed, set user data
    if (!requestFailed) {
      user = getProp(user, this.options.user)

      this.$auth.setUser(user)
    }
  }

  async logout (endpoint = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add refresh token to payload if enabled
      const refreshToken = this.options.dataRefreshToken
      if (refreshToken) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[refreshToken] = this.$auth.getRefreshToken(this.name)
      }
    }

    // But logout locally regardless
    return super.logout(endpoint)
  }

  async reset () {
    this._clearToken()
    this.refreshController.reset()

    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)
    this.tokenStatus.setTokenExpiration(false)
    this.tokenStatus.setRefreshTokenExpiration(false)
    this._setClientId(false)

    return Promise.resolve()
  }
}

const DEFAULTS = {
  autoLogout: false,
  autoRefresh: false,
  grantType: 'refresh_token',
  refreshToken: {
    property: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30
  },
  clientId: 'client_id',
  issuedAt: 'issued_at',
  expiresAt: 'expires_at',
  expiresIn: 'expires_in',
  dataRefreshToken: 'refresh_token',
  dataClientId: false,
  dataGrantType: false,
  tokenExpirationPrefix: '_token_expires_at.',
  refreshTokenExpirationPrefix: '_refresh_token_expires_at.',
  endpoints: {
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    }
  }
}
