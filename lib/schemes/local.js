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
    const _key = this.options.clientIdPrefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setClientId (clientId) {
    const _key = this.options.clientIdPrefix + this.name

    return this.$auth.$storage.setUniversal(_key, clientId)
  }

  _syncClientId () {
    const _key = this.options.clientIdPrefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  mounted () {
    if (this.options.token.required) {
      this.$auth.token.sync()
    }

    this._syncClientId()

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

    // Update Token
    if (this.options.token.required) {
      this.$auth.token.set(getProp(data, this.options.token.property))
    }

    // Update clientId
    const clientId = getProp(data, this.options.clientId)
    if (clientId) {
      this._setClientId(clientId)
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
      const dataClientId = this.options.clientId.data
      if (dataClientId) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[dataClientId] = this._getClientId()
      }

      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset () {
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
