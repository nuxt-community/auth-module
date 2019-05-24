import getProp from 'dotprop'

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

  async mounted () {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
      this.$auth.syncClientId(this.name)
      this.$auth.syncRemember(this.name)
    }

    return this.$auth.fetchUserOnce()
  }

  async login (...args) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    if (args.length > 0 && args[0].constructor === Boolean) {
      this.$auth.setRemember(this.name, args[0])
      args.shift()
    }

    const endpoint = args[0]

    const result = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    const cookieOptions = { expires: null }
    const rememberFor = this.$auth.options.cookie.options.expires

    if (this.$auth.getRemember(this.name)) {
      cookieOptions.expires = rememberFor
    }

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + getProp(result, this.options.endpoints.login.propertyName)
        : getProp(result, this.options.endpoints.login.propertyName)

      this.$auth.setToken(this.name, token, cookieOptions)
      this._setToken(token)
    }

    const clientId = getProp(result, this.options.endpoints.login.clientId)

    // Update client id
    if (clientId !== undefined) {
      this.$auth.setClientId(this.name, clientId, cookieOptions)
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
    let user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )

    // Only set user if property name is defined
    if (this.options.endpoints.user.propertyName) {
      user = getProp(user, this.options.endpoints.user.propertyName)
    }

    this.$auth.setUser(user)
  }

  async logout (endpoint) {
    // Making sure that endpoint is an Object
    if (!endpoint || endpoint.constructor !== Object) {
      endpoint = { data: {} }
    }

    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      const payloadProperties = this.options.endpoints.logout.payloadProperties

      // Only add client id to payload if enabled
      if (payloadProperties.clientId !== false) {
        endpoint.data[payloadProperties.clientId] = this.$auth.getClientId(this.name)
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
