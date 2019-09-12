import defu from 'defu'
import LocalScheme from './local'
import { getProp } from '../utilities'

export default class RefreshScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))

    this.refreshInterval = undefined
    this.isRefreshing = false
    this.hasRefreshTokenChanged = false
  }

  // ---------------------------------------------------------------
  // Token Expiration helpers
  // ---------------------------------------------------------------

  _getTokenExpiration () {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setTokenExpiration (token) {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, token)
  }

  _syncTokenExpiration () {
    const _key = this.options.tokenExpirationPrefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  // ---------------------------------------------------------------
  // Refresh Token Expiration helpers
  // ---------------------------------------------------------------

  _getRefreshTokenExpiration () {
    const _key = this.options.refreshTokenExpirationPrefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setRefreshTokenExpiration (token) {
    const _key = this.options.refreshTokenExpirationPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, token)
  }

  _syncRefreshTokenExpiration () {
    const _key = this.options.refreshTokenExpirationPrefix + this.name

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
      let token = getProp(result, this.options.token.property)
      if (this.options.tokenType) {
        token = this.options.tokenType + ' ' + token
      }

      // Update access token
      this.$auth.setToken(this.name, token)
      super._setToken(token)

      // Update refresh token and register refresh-logic with axios
      const refreshToken = getProp(result, this.options.refreshToken.property)
      if (refreshToken !== undefined) {
        this.hasRefreshTokenChanged = refreshToken !== this._getRefreshToken()
        this._setRefreshToken(refreshToken)

        const _tokenCreatedAt = getProp(result, this.options.createdAt) || Date.now()
        const _tokenTTL = getProp(result, this.options.expiresIn) || this.options.token.maxAge
        const tokenExpiration = _tokenCreatedAt + (_tokenTTL * 1000)
        this._setTokenExpiration(tokenExpiration)

        // Update refresh token expiration
        const refreshTokenMaxAge = this.options.refreshToken.maxAge
        if (refreshTokenMaxAge) {
          if (!this._getRefreshTokenExpiration() || this.hasRefreshTokenChanged) {
            this._setRefreshTokenExpiration(Date.now() + (refreshTokenMaxAge * 1000))
            this.hasRefreshTokenChanged = false
          }
        }
      }

      // Update client id
      const clientId = getProp(result, this.options.clientId)
      if (clientId) {
        this.$auth.setClientId(this.name, clientId)
      }

      // End the refresh
      this.isRefreshing = false
    }
  }

  async _tokenRefresh () {
    // Refresh endpoint is disabled
    if (!this.options.endpoints.refresh) return

    // Sync tokens
    this._setToken(this.$auth.syncToken(this.name))
    this._syncRefreshToken()

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
    if (!this.options.autoRefresh.enable) return

    let intervalDuration = (this._getTokenExpiration() - Date.now()) * 0.75
    if (intervalDuration < 1000) {
      // in case you misconfigured refreshing this will save your auth-server from a self-induced DDoS-Attack
      intervalDuration = 1000
    }

    this.refreshInterval = setInterval(() => {
      this._tokenRefresh()
    }, intervalDuration)
  }

  _initializeRequestInterceptor () {
    this.$auth.ctx.app.$axios.onRequest(async config => {
      // Sync tokens
      const token = this.$auth.syncToken(this.name) || false
      const refreshToken = this._syncRefreshToken()
      this._setToken(token)

      // If no token or no refresh token, bail
      if (!token || !refreshToken) return config
      
      // Update header
      config.headers[this.options.tokenName] = token

      const now = new Date().setMilliseconds(0)
      const tokenExpiration = new Date(this._getTokenExpiration()).setMilliseconds(0)
      let refreshTokenExpiration = this._getRefreshTokenExpiration()

      if (refreshTokenExpiration) {
        refreshTokenExpiration = new Date(refreshTokenExpiration).setMilliseconds(0)
      }

      if (!this.isRefreshing) {
        if (now >= tokenExpiration) {
          if (now < refreshTokenExpiration) {
            // Refresh the token
            return this._tokenRefresh().then(() => {
              this._scheduleTokenRefresh()

              // Update Authorization header
              config.headers[this.options.tokenName] = this.$auth.getToken(this.name)
              return Promise.resolve(config)
            }).catch(error => this._logoutLocally())
          } else {
            this._logoutLocally()
          }
        }
      } else if (config.url !== this.options.endpoints.refresh.url) {
        return new Promise(async (resolve, reject) => {
          let waitForRefresh
          await (waitForRefresh = () => {
            if (!this.isRefreshing) {
              config.headers[this.options.tokenName] = this.$auth.getToken(this.name)
              return resolve(config)
            }
            setTimeout(waitForRefresh, 30)
          })()
        })
      }

      return config
    })
  }

  async mounted () {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._syncRefreshToken()
      this._setToken(token)

      const now = new Date().setMilliseconds(0)
      const tokenExpiration = this._syncTokenExpiration()
      const refreshTokenExpiration = this._syncRefreshTokenExpiration()

      if (refreshTokenExpiration && now >= new Date(refreshTokenExpiration).setMilliseconds(0)) {
        await this._logoutLocally()
      } else if (this.options.autoLogout && tokenExpiration && now >= new Date(tokenExpiration).setMilliseconds(0)) {
        await this._logoutLocally()
      }

      this.$auth.syncClientId(this.name)
    }

    if (!this.options.autoLogout) {
      // Initialize axios request interceptor
      this._initializeRequestInterceptor()
    }

    return this.$auth.fetchUserOnce().then((response) => {
      if (this.options.autoLogout) {
        // Initialize axios request interceptor
        this._initializeRequestInterceptor()
      }

      // Only refresh token if user is logged in and is client side
      if (process.client && this.$auth.loggedIn && this.options.autoRefresh.enable) {
        this._tokenRefresh().then(() => {
          this._scheduleTokenRefresh()
        })
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
    this.hasRefreshTokenChanged = false

    this._setRefreshToken(false)
    this._setTokenExpiration(false)
    this._setRefreshTokenExpiration(false)

    return this.$auth.reset()
  }
}

const DEFAULTS = {
  autoLogout: false,
  autoRefresh: {
    enable: false
  },
  grantType: 'refresh_token',
  refreshToken: {
    property: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30
  },
  clientId: 'client_id',
  createdAt: 'created_at',
  expiresIn: 'expires_in',
  dataRefreshToken: 'refresh_token',
  dataClientId: 'client_id',
  dataGrantType: 'grant_type',
  tokenExpirationPrefix: '_token_expires_at.',
  refreshTokenExpirationPrefix: '_refresh_token_expires_at.',
  refreshTokenPrefix: '_refresh_token.',
  endpoints: {
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    }
  }
}
