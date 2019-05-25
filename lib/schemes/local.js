import { getProp } from '../utilities'

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
      this.$auth.syncClientId(this.name)
      this.$auth.syncRemember(this.name)
    }

    return this.$auth.fetchUserOnce()
  }

  async login (endpoint, remember) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    // Make login request
    const loginResult = await this.$auth.request(endpoint, this.options.endpoints.login)

    // RememberMe
    if (remember !== undefined) {
      this.$auth.setRemember(this.name, remember)
    }
    const cookieOptions = { expires: null }
    if (this.$auth.getRemember(this.name)) {
      cookieOptions.expires = this.$auth.options.cookie.options.expires
    }

    // Update Token
    if (this.options.tokenRequired) {
      let token = getProp(loginResult, this.options.endpoints.login.propertyName)
      if (this.options.tokenType) {
        token = this.options.tokenType + ' ' + token
      }
      this.$auth.setToken(this.name, token, cookieOptions)
      this._setToken(token)
    }

    // Update clientId
    const clientId = getProp(loginResult, this.options.endpoints.login.clientId)
    if (clientId) {
      this.$auth.setClientId(this.name, clientId, cookieOptions)
    }

    // Fetch user
    return this.fetchUser()
  }

  async setUserToken (token) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    // Update token
    if (this.options.tokenRequired) {
      if (this.options.tokenType) {
        token = this.options.tokenType + ' ' + token
      }
      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    // Fetch user
    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    let user = await this.$auth.requestWith(this.name, endpoint, this.options.endpoints.user)
    user = getProp(user, this.options.endpoints.user.propertyName)

    this.$auth.setUser(user)
  }

  async logout (endpoint = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add client id to payload if enabled
      const { clientId } = this.options.endpoints.logout.payloadProperties
      if (clientId) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[clientId] = this.$auth.getClientId(this.name)
      }

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
