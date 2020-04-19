import defu from 'defu'
import LocalScheme from './local'
import { getResponseProp } from '../utilities'
import RefreshController from '../refreshController'
import ExpiredAuthSessionError from '../includes/ExpiredAuthSessionError'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))

    // Initialize Refresh Controller
    this.refreshController = new RefreshController(this)
  }

  async mounted () {
    // Sync tokens
    this.$auth.token.sync()
    this.$auth.refreshToken.sync()

    // Sync client id
    if (this.options.clientId) {
      this._syncClientId()
    }

    // Get token and refresh token status
    const tokenStatus = this.$auth.token.status()
    const refreshTokenStatus = this.$auth.refreshToken.status()

    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (refreshTokenStatus.expired()) {
      await this.$auth.reset()
    } else if (this.options.autoLogout && tokenStatus.expired()) {
      await this.$auth.reset()
    }

    // Initialize request interceptor
    this.refreshController.initializeRequestInterceptor(this.options.endpoints.refresh.url)

    // Fetch user once
    return this.$auth.fetchUserOnce().then(() => {
      // Only refresh token if user is logged in and is client side
      if (process.client && this.$auth.loggedIn && this.options.autoRefresh) {
        this.refreshController.handleRefresh()
          // Initialize scheduled refresh
          .then(() => this.refreshController.initializeScheduledRefresh())
      }
    })
  }

  check () {
    if (!this.$auth.token.get() || !this.$auth.refreshToken.get()) {
      return false
    }

    return true
  }

  async login (endpoint) {
    // Login endpoint is disabled
    if (!this.options.endpoints.login) return

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update tokens
    this.$auth.token.set(getResponseProp(response, this.options.token.property))
    this.$auth.refreshToken.set(getResponseProp(response, this.options.refreshToken.property))

    // Update client id
    if (this.options.clientId) {
      this._setClientId(getResponseProp(response, this.options.clientId.property))
    }

    // Initialize scheduled refresh if `autoRefresh` is enabled
    if (this.options.autoRefresh) {
      this.refreshController.initializeScheduledRefresh()
    }

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (!this.check()) return

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    let requestFailed = false

    // Try to fetch user and then set
    const response = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).catch(error => {
      requestFailed = true
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })

    // If the request has not failed, set user data
    if (!requestFailed) {
      this.$auth.setUser(getResponseProp(response, this.options.user.property))
    }
  }

  async refreshTokens () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) return

    // Token and refresh token are required but not available
    if (!this.check()) return

    // Get refresh token status
    const refreshTokenStatus = this.$auth.refreshToken.status()

    // Refresh token is expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      await this.$auth.reset()

      throw new ExpiredAuthSessionError()
    }

    const endpoint = {
      data: {
        [this.options.refreshToken.data]: this.$auth.refreshToken.get()
      }
    }

    // Only add client id to payload if enabled
    if (this.options.clientId) {
      endpoint.data[this.options.clientId.data] = this._getClientId()
    }

    // Only add grant type to payload if enabled
    if (this.options.grantType) {
      endpoint.data[this.options.grantType.data] = this.options.grantType.value
    }

    // Make refresh request
    return this.$auth.request(
      endpoint,
      this.options.endpoints.refresh,
      true
    ).then((response) => {
      const token = getResponseProp(response, this.options.token.property)
      const refreshToken = getResponseProp(response, this.options.refreshToken.property)

      // Update tokens
      this.$auth.token.set(token)

      if (refreshToken) {
        this.$auth.refreshToken.set(refreshToken)
      }

      // Update client id
      const clientId = getResponseProp(response, this.options.clientId.property)
      if (this.options.clientId && clientId) {
        this._setClientId(clientId)
      }

      return response
    }).catch(error => {
      this.$auth.callOnError(error, { method: 'refreshToken' })
    })
  }

  async reset () {
    if (this.options.clientId) {
      this._setClientId(false)
    }

    this.$auth.setUser(false)
    this.$auth.token.reset()
    this.$auth.refreshToken.reset()
    this.refreshController.reset()

    return Promise.resolve()
  }
}

const DEFAULTS = {
  endpoints: {
    login: {
      url: '/api/auth/login',
      method: 'post'
    },
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    },
    logout: {
      url: '/api/auth/logout',
      method: 'post'
    },
    user: {
      url: '/api/auth/user',
      method: 'get'
    }
  },
  token: {
    property: 'token',
    type: 'Bearer',
    name: 'Authorization',
    maxAge: 1800,
    global: true,
    required: true
  },
  refreshToken: {
    property: 'refresh_token',
    data: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30
  },
  user: {
    property: 'user',
    autoFetch: true
  },
  clientId: {
    property: 'client_id',
    data: 'client_id',
    prefix: '_client_id.'
  },
  grantType: {
    data: 'grant_type',
    value: 'refresh_token'
  },
  autoRefresh: false,
  autoLogout: false
}
