import LocalScheme from './local'
import { getProp } from '../utilities'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, {
      ...DEFAULTS,
      ...options
    })

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

  _setExpiration (token, options) {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, token, options)
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

  _setRefreshToken (refreshToken, options) {
    const _key = this.options.refreshTokenPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, refreshToken, options)
  }

  _syncRefreshToken () {
    const _key = this.options.refreshTokenPrefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  async _updateTokens (result) {
    var accessToken = getProp(result, this.options.endpoints.login.propertyName)

    // Extract refresh token and set expiration
    var tokenCreatedAt = getProp(result, this.options.endpoints.refresh.createdAt) || Date.now()
    var refreshToken = getProp(result, this.options.endpoints.refresh.token)
    var defaultExpirationTime = parseInt(this.options.endpoints.refresh.defaultExpirationTime) || 1800
    var tokenExpiration = getProp(result, this.options.endpoints.refresh.expiresIn)
    var clientId = getProp(result, this.options.endpoints.refresh.clientId)

    if (tokenExpiration) {
      tokenExpiration = tokenCreatedAt + (tokenExpiration * 1000)
    } else if (defaultExpirationTime) {
      tokenExpiration = tokenCreatedAt + (defaultExpirationTime * 1000)
    }

    if (this.options.tokenRequired) {
      const token = this.options.tokenType ? this.options.tokenType + ' ' + accessToken : accessToken
      const cookieOptions = { expires: null }
      const rememberFor = this.$auth.options.cookie.options.expires

      // If remember is true, set cookie expiration time
      if (this.$auth.getRemember(this.name)) {
        cookieOptions.expires = rememberFor
      }

      // Update access token
      this.$auth.setToken(this.name, token, cookieOptions)
      super._setToken(token)

      // Update refresh token and register refresh-logic with axios
      if (refreshToken !== undefined) {
        this._setRefreshToken(refreshToken, cookieOptions)
        this._setExpiration(tokenExpiration, cookieOptions)
      }

      // Update client id
      if (clientId !== undefined) {
        this.$auth.setClientId(this.name, clientId, cookieOptions)
      }

      // If have failed requests in the queue
      if (this.failedRequestQueue.length !== 0) {
        // Initialize a local queue for axios requests
        const failedRequestQueue = []

        // Create axios request for each config in failedRequestQueue
        this.failedRequestQueue.forEach((config) => {
          config.headers[this.options.tokenName] = this.$auth.getToken(this.name)
          failedRequestQueue.push(this.$auth.ctx.app.$axios.request(config))
        })

        // Clear global queue
        this.failedRequestQueue = []

        // Retry all failed requests
        await Promise.all(failedRequestQueue)
      }

      // End the refresh
      this.isRefreshing = false
    }
  }

  async _tokenRefresh (self) {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) return

    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) return

    // Token is already being refreshed
    if (this.isRefreshing) return

    // Start the refresh
    this.isRefreshing = true

    const payloadProperties = this.options.endpoints.refresh.payloadProperties
    const endpoint = {
      data: {
        [payloadProperties.refreshToken]: this._getRefreshToken()
      }
    }

    // Only add client id to payload if enabled
    if (payloadProperties.clientId !== false) {
      endpoint.data[payloadProperties.clientId] = this.$auth.getClientId(this.name)
    }

    // Only add grant type to payload if enabled
    if (payloadProperties.grantType !== false) {
      endpoint.data[payloadProperties.grantType] = this.options.endpoints.refresh.grantType
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.refresh
    ).then(response => {
      this._updateTokens(response)
    }).catch(err => {
      this._logoutLocally()
    })
  }

  _scheduleTokenRefresh () {
    if (this.options.endpoints.refresh.disableAutoRefresh) {
      return
    }

    let self = this
    let intervalDuration = (self._getExpiration() - Date.now()) * 0.75
    if (intervalDuration < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDuration = 1000
    }

    this.refreshInterval = setInterval(function () {
      self._tokenRefresh()
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
      this.$auth.syncRemember(this.name)
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

  async login (endpoint, remember) {
    // Login endpoint is disabled
    if (!this.options.endpoints.login) return

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    // Make login request
    const loginResult = await this.$auth.request(endpoint, this.options.endpoints.login)

    // RememberMe
    if (remember !== undefined) {
      this.$auth.setRemember(this.name, remember)
    }

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
    ).catch(err => {
      requestFailed = true
    })

    // If the request has not failed, set user data
    if (!requestFailed) {
      if (this.options.endpoints.user.propertyName) {
        user = getProp(user, this.options.endpoints.user.propertyName)
      }

      this.$auth.setUser(user)
    }
  }

  async logout (endpoint = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add refresh token to payload if enabled
      const { refreshToken } = this.options.endpoints.logout.payloadProperties
      if (refreshToken) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[this.options.endpoints.refresh.payloadProperties.refreshToken] = this._getRefreshToken()
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
  // -- Token Expiration --
  tokenExpirationPrefix: '_token_expires_at.',

  // -- Refresh token --
  refreshTokenPrefix: '_refresh_token.'
}
