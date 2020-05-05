import { cleanObj, getResponseProp } from '../utils'
import RefreshController from '../inc/refresh-controller'
import ExpiredAuthSessionError from '../inc/expired-auth-session-error'
import LocalScheme from './local'

const DEFAULTS = {
  name: 'refresh',
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
    maxAge: 60 * 60 * 24 * 30,
    required: true
  },
  user: {
    property: 'user',
    autoFetch: true
  },
  clientId: false,
  grantType: false,
  autoLogout: false
}

export default class RefreshScheme extends LocalScheme {
  public refreshController: RefreshController

  constructor ($auth, options) {
    super($auth, options, DEFAULTS)

    // Initialize Refresh Controller
    this.refreshController = new RefreshController(this)
  }

  async mounted () {
    // Sync tokens
    this.$auth.token.sync()
    this.$auth.refreshToken.sync()

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
    this.requestHandler.initializeRequestInterceptor(this.options.endpoints.refresh.url)

    // Fetch user once
    return this.$auth.fetchUserOnce()
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

  async login (endpoint) {
    // Login endpoint is disabled
    if (!this.options.endpoints.login) { return }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // Add client id to payload if enabled
    if (this.options.clientId) {
      endpoint.data.client_id = this.options.clientId
    }

    // Add grant type to payload if defined
    if (this.options.grantType) {
      endpoint.data.grant_type = this.options.grantType
    }

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update token
    const token = getResponseProp(response, this.options.token.property)
    const refreshToken = this.options.refreshToken.required ? getResponseProp(response, this.options.refreshToken.property) : false

    this.$auth.token.set(token)
    this.$auth.refreshToken.set(refreshToken)

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async fetchUser (endpoint?) {
    // Token is required but not available
    if (!this.check()) { return }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      this.$auth.setUser(getResponseProp(response, this.options.user.property))
      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })
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
      await this.$auth.reset()

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
      const token = getResponseProp(response, this.options.token.property)
      const refreshToken = this.options.refreshToken.required ? getResponseProp(response, this.options.refreshToken.property) : false

      // Update tokens
      this.$auth.token.set(token)

      if (refreshToken) {
        this.$auth.refreshToken.set(refreshToken)
      }

      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'refreshToken' })
    })
  }

  async reset () {
    this.$auth.setUser(false)
    this.$auth.token.reset()
    this.$auth.refreshToken.reset()
    this.refreshController.reset()

    return Promise.resolve()
  }
}
