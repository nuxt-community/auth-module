export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

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

  mounted () {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
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

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + result
        : result

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    return this.fetchUser()
  }

  async setUserToken (tokenValue) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + tokenValue
        : tokenValue

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
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

    return this.$auth.reset()
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization'
}
