import defu from 'defu'
import { getProp } from '../utilities'

export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = defu(options, DEFAULTS)
  }

  // ---------------------------------------------------------------
  // Client ID helpers
  // ---------------------------------------------------------------

  _getClientId () {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setClientId (clientId) {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.setUniversal(_key, clientId)
  }

  _syncClientId () {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  mounted () {
    if (this.options.token.required) {
      // Sync token
      this.$auth.token.sync()

      // Get token status
      const tokenStatus = this.$auth.token.status()

      // Token is expired. Force reset.
      if (tokenStatus.expired()) {
        this.$auth.reset()
      }
    }

    if (this.options.clientId) {
      this._syncClientId()
    }

    return this.$auth.fetchUserOnce()
  }

  async login (endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // Make login request
    const { response, data } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update logged in state
    this.$auth.loggedIn.set(true)

    // Update token
    if (this.options.token.required) {
      this.$auth.token.set(getProp(data, this.options.token.property))
    }

    // Update clientId
    if (this.options.clientId) {
      this._setClientId(getProp(data, this.options.clientId))
    }

    // Fetch user
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken (tokenValue) {
    this.$auth.token.set(getProp(tokenValue, this.options.token.property))

    // Fetch user
    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // User not logged in
    if (!this.$auth.loggedIn.get()) {
      return
    }

    // Token is required but not available
    if (this.options.token.required && !this.$auth.token.get()) {
      return
    }

    // User endpoint is disabled
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    const { data } = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )

    this.$auth.setUser(getProp(data, this.options.user.property))
  }

  async logout (endpoint = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add client id to payload if enabled
      if (this.options.clientId) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[this.options.clientId.data] = this._getClientId()
      }

      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset () {
    this.$auth.loggedIn.set(false)
    this._setClientId(false)
    this.$auth.setUser(false)
    this.$auth.token.reset()

    return Promise.resolve()
  }
}

const DEFAULTS = {
  endpoints: {
    login: {
      url: '/api/auth/login',
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
  user: {
    property: 'user',
    autoFetch: true
  },
  clientId: {
    property: 'client_id',
    data: 'client_id',
    prefix: '_client_id.'
  }
}
