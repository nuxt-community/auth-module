export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name
    this.refreshInterval = undefined

    this.options = Object.assign({}, DEFAULTS, options)
  }

  _setToken (token) {
    if (this.options.globalToken) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
    }
  }

  _clearToken () {
    if (this.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
    }
  }

  _updateTokens (result) {
    let accessToken = result[this.options.endpoints.login.propertyName]

    //extract refresh token and set expiration
    if (this.options.refreshToken) {
      var tokenCreatedAt = result['created_at'] || Date.now
      var refreshToken = result[this.options.refreshToken]
      var tokenExpiration = tokenCreatedAt + result['expires_in']
    }

    if (this.options.tokenRequired) {
      const token = this.options.tokenType ? this.options.tokenType + ' ' + accessToken : accessToken

      // update access token
      this.$auth.setToken(this.name, token)
      this._setToken(token)

      // update refresh token and register refresh-logic with axios
      if ( refreshToken !== undefined) {
        this.$auth.setRefreshToken(this.name, refreshToken)
        this.$auth.setExpiration(this.name, tokenExpiration * 1000)
      }
    }
  }

  _tokenRefresh (self) {
    return this.$auth.ctx.app.$axios.post(
      this.options.endpoints.login.url,
      {
        refresh_token: this.$auth.getRefreshToken(this.name),
        client_id: this.options.client_id,
        grant_type: 'refresh_token'
      }
    ).then(response => {
      this._updateTokens(response.data)
    }).catch(err => {
      this.logout()
    })
  }

  _scheduleTokenRefresh () {
    let self = this
    let intervalDuration = (self.$auth.getExpiration(self.name) - Date.now()) * 0.75

    this.refreshInterval = setInterval(function () {
      console.log("iterate")
      self._tokenRefresh()
    }, intervalDuration);
  }

  mounted () {
    if (this.options.tokenRequired && this.$auth.loggedIn) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)

      if (this.options.refreshToken) {
        this.$auth.syncRefreshToken(this.name)
        this._tokenRefresh().then(() => {
          this.$auth.syncExpiration(this.name)
          this._scheduleTokenRefresh()
        })
      }
    }

    return this.$auth.fetchUserOnce()
  }

  async login (endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

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
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // Try to fetch user and then set
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )
    this.$auth.setUser(user)
  }

  async logout (endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But logout locally regardless
    return this._logoutLocally()
  }

  async _logoutLocally () {
    if (this.options.tokenRequired) {
      this._clearToken()
    }
    clearInterval(this.refreshInterval)

    return this.$auth.reset()
  }
}

const DEFAULTS = {
  refreshToken: false,
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization'
}
