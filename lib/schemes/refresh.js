import defu from 'defu'
import LocalScheme from './local'
import { getProp } from '../utilities'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))

    this.refreshInterval = undefined
    this.isRefreshing = false
    this.failedRequestQueue = []
  }

  // ---------------------------------------------------------------
  // Token Expiration helpers
  // ---------------------------------------------------------------

  _getExpiration () {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setExpiration (token) {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, token)
  }

  _syncExpiration () {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  // ---------------------------------------------------------------
  // Refresh token helpers
  // ---------------------------------------------------------------

  _getRefreshToken () {
    const _key = this.options.refreshTokenPrefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setRefreshToken (refreshToken) {
    const _key = this.options.refreshTokenPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, refreshToken)
  }

  _syncRefreshToken () {
    const _key = this.options.refreshTokenPrefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  async _updateTokens (result) {
    if (this.options.tokenRequired) {
      let token = getProp(result, this.options.token)
      if (this.options.tokenType) {
        token = this.options.tokenType + ' ' + token
      }

      // Update access token
      this.$auth.setToken(this.name, token)
      super._setToken(token)

      // Update refresh token and register refresh-logic with axios
      const refreshToken = getProp(result, this.options.refreshToken)
      if (refreshToken !== undefined) {
        this._setRefreshToken(refreshToken)

        const _tokenCreatedAt = getProp(result, this.options.createdAt) || Date.now()
        const _tokenTTL = getProp(result, this.options.expiresIn) || this.options.defaultExpirationTime
        const tokenExpiration = _tokenCreatedAt + (_tokenTTL * 1000)
        this._setExpiration(tokenExpiration)
      }

      // Update client id
      const clientId = getProp(result, this.options.clientId)
      if (clientId) {
        this.$auth.setClientId(this.name, clientId)
      }

      // If have failed requests in the queue
      if (this.failedRequestQueue.length) {
        // Initialize a local queue for axios requests for each config in failedRequestQueue
        const failedRequestQueue = this.failedRequestQueue.map(config => this.$auth.requestWith(this.name, config))

        // Clear global queue
        this.failedRequestQueue = []

        // Retry all failed requests
        await Promise.all(failedRequestQueue)
      }

      // End the refresh
      this.isRefreshing = false
    }
  }

  async _tokenRefresh () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) return

    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) return

    // Token is already being refreshed
    if (this.isRefreshing) return

    // Start the refresh
    this.isRefreshing = true

    let { dataClientId, dataGrantType, grantType } = this.options
    const endpoint = {
      data: {
        [this.options.dataRefreshToken]: this._getRefreshToken()
      }
    }

    // Only add client id to payload if enabled
    if (dataClientId) {
      endpoint.data[dataClientId] = this.$auth.getClientId(this.name)
    }

    // Only add grant type to payload if enabled
    if (dataGrantType !== false) {
      endpoint.data[dataGrantType] = grantType
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.refresh
    ).then(response => {
      this._updateTokens(response)
    }).catch(() => {
      // TODO: Unhandled error
      this._logoutLocally()
    })
  }

  _scheduleTokenRefresh () {
    // If auto refresh is disabled, bail
    if (this.options.disableAutoRefresh) return

    let intervalDuration = (this._getExpiration() - Date.now()) * 0.75
    if (intervalDuration < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDuration = 1000
    }

    this.refreshInterval = setInterval(() => {
      this._tokenRefresh()
    }, intervalDuration)
  }

  _initializeErrorInterceptor () {
    this.$auth.ctx.app.$axios.onError(error => {
      // If error has config and response and error status is 401
      if (error.config && error.response && error.response.status === 401) {
        const token = this.$auth.getToken(this.name)
        const headerToken = error.config.headers[this.options.tokenName]

        // If current token is equal to header token
        if (token && headerToken && headerToken === token) {
          // Add the failed request config to failedRequestQueue
          if (!error.config.__isRetryRequest) {
            error.config.__isRetryRequest = true
            this.failedRequestQueue.push(error.config)
          }

          // If is not refreshing the token
          if (!this.isRefreshing) {
            // Refresh it
            return this._tokenRefresh().then(() => {
              this._syncExpiration()
              this._scheduleTokenRefresh()
            })
          } else {
            // Or resolve Promise
            return Promise.resolve()
          }
        } else if (token && headerToken && headerToken !== token && !error.config.__isRetryRequest) {
          // Or just retry the request if token is not equal to header token
          error.config.__isRetryRequest = true
          error.config.headers[this.options.tokenName] = token
          return this.$auth.ctx.app.$axios.request(error.config)
        }
      }

      // Otherwise, reject Promise
      return Promise.reject(error)
    })
  }

  async mounted () {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
      this._syncRefreshToken()

      const expiration = this._syncExpiration()
      if (Date.now() >= expiration) {
        await this._logoutLocally()
      }

      this.$auth.syncClientId(this.name)
    }

    return this.$auth.fetchUserOnce().then((response) => {
      // Initialize axios error interceptor
      this._initializeErrorInterceptor()

      // Only refresh token if user is logged in and is client side
      if (process.client && this.$auth.loggedIn) {
        setTimeout(() => {
          this._tokenRefresh().then(() => {
            this._syncExpiration()
            this._scheduleTokenRefresh()
          })
        }, 1000)
      }
    })
  }

  async login (endpoint) {
    // Login endpoint is disabled
    if (!this.options.endpoints.login) return

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    // Make login request
    const loginResult = await this.$auth.request(endpoint, this.options.endpoints.login)

    this._updateTokens(loginResult)
    this._scheduleTokenRefresh()

    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) return

    let requestFailed = false

    // Try to fetch user and then set
    let user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).catch(() => {
      // TODO: Unhandled error
      requestFailed = true
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
        endpoint.data[refreshToken] = this._getRefreshToken()
      }
    }

    // But logout locally regardless
    return super.logout(endpoint)
  }

  async _logoutLocally () {
    if (this.options.tokenRequired) {
      this._clearToken()
    }
    clearInterval(this.refreshInterval)

    this.isRefreshing = false
    this.failedRequestQueue = []

    this._setRefreshToken(false)
    this._setExpiration(false)

    return this.$auth.reset()
  }
}

const DEFAULTS = {
  defaultExpirationTime: 1800,
  disableAutoRefresh: false,
  grantType: 'refresh_token',
  refreshToken: 'refresh_token',
  clientId: 'client_id',
  createdAt: 'created_at',
  expiresIn: 'expires_in',
  dataRefreshToken: 'refresh_token',
  dataClientId: 'client_id',
  dataGrantType: 'grant_type',
  tokenExpirationPrefix: '_token_expires_at.',
  refreshTokenPrefix: '_refresh_token.',
  endpoints: {
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    }
  }
}
