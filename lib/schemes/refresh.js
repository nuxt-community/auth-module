import LocalScheme from './local'
import getProp from 'dotprop'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, options)

    this.refreshInterval = undefined
    this.isRefreshing = false
    this.failedRequestQueue = []
  }

  // ---------------------------------------------------------------
  // Token Expiration helpers
  // ---------------------------------------------------------------

  _getExpiration () {
    const _key = this.options.token_expiration.prefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setExpiration (token) {
    const _key = this.options.token_expiration.prefix + this.name

    return this.$auth.$storage.setUniversal(_key, token)
  }

  _syncExpiration () {
    const _key = this.options.token_expiration.prefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  // ---------------------------------------------------------------
  // Refresh token helpers
  // ---------------------------------------------------------------

  _getRefreshToken () {
    const _key = this.options.refresh_token.prefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setRefreshToken (refreshToken) {
    const _key = this.options.refresh_token.prefix + this.name

    return this.$auth.$storage.setUniversal(_key, refreshToken)
  }

  _syncRefreshToken () {
    const _key = this.options.refresh_token.prefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  async _updateTokens (result) {
    const accessToken = getProp(result, this.options.endpoints.login.propertyName)

    // Extract refresh token and set expiration
    var tokenCreatedAt = getProp(result, this.options.endpoints.refresh.createdAt) || Date.now()
    var refreshToken = getProp(result, this.options.endpoints.refresh.token)
    var defaultExpirationTime = parseInt(this.options.endpoints.refresh.defaultExpirationTime) || 1800
    var tokenExpiration = getProp(result, this.options.endpoints.refresh.expiresIn)
    var clientId = getProp(result, this.options.endpoints.refresh.clientId)

    if (tokenExpiration) {
      tokenExpiration = tokenCreatedAt + (tokenExpiration * 1000)
    } else if (defaultExpirationTime && typeof defaultExpirationTime === 'number') {
      tokenExpiration = tokenCreatedAt + (defaultExpirationTime * 1000)
    }

    if (this.options.tokenRequired) {
      const token = this.options.tokenType ? this.options.tokenType + ' ' + accessToken : accessToken

      // Update access token
      this.$auth.setToken(this.name, token)
      super._setToken(token)

      // Update refresh token and register refresh-logic with axios
      if (refreshToken !== undefined) {
        this._setRefreshToken(refreshToken)
        this._setExpiration(tokenExpiration)
      }

      // Update client id
      if (clientId !== undefined) {
        this.$auth.setClientId(this.name, clientId)
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
        [payloadProperties.refreshToken]: this.$auth.getRefreshToken()
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
    let intervalDuration = (self._getExpiration(self.name) - Date.now()) * 0.75
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
        var token = this.$auth.getToken(this.name)
        var headerToken = error.config.headers[this.options.tokenName]

        // If current token is equal to header token
        if (token && headerToken && headerToken === token) {
          // Add the failed request config to failedRequestQueue
          if (!error.config.__isRetryRequest) {
            error.config.__isRetryRequest = true
            this.failedRequestQueue.push(error.config)
          }

          // If is not refreshing the token
          if (!this.isRefreshing) {
            var self = this

            // Refresh it
            return self._tokenRefresh().then(() => {
              self._syncExpiration()
              self._scheduleTokenRefresh()
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
      this._syncRefreshToken()

      const expiration = this._syncExpiration()
      if (Date.now() >= expiration) {
        await this._logoutLocally()
      }

      this.$auth.syncClientId(this.name)
    }

    super.mounted().then((response) => {
      // Initialize axios error interceptor
      this._initializeErrorInterceptor()

      // Only refresh token if user is logged in and is client side
      if (process.client && this.$auth.loggedIn) {
        var self = this
        setTimeout(function () {
          self._tokenRefresh().then(() => {
            self._syncExpiration()
            self._scheduleTokenRefresh()
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

    const result = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    this._updateTokens(result)
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

  async logout (endpoint) {
    // Making sure that endpoint is an Object
    if (!endpoint || endpoint.constructor !== Object) {
      endpoint = {data: {}}
    }

    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      const payloadProperties = this.options.endpoints.logout.payloadProperties

      // Only add refresh token to payload if enabled
      if (payloadProperties.refreshToken !== false) {
        endpoint.data[this.options.endpoints.refresh.payloadProperties.refreshToken] = this._getRefreshToken()
      }

      // Only add client id to payload if enabled
      if (payloadProperties.clientId !== false) {
        endpoint.data[payloadProperties.clientId] = this.$auth.getClientId(this.name)
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

    return this.$auth.reset()
  }
}
