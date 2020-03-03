import defu from 'defu'
import { getProp } from '../utilities'

export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name
    this.options = defu(options, DEFAULTS)
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
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
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
    const loginResult = await this.$auth.request(endpoint, this.options.endpoints.login)

    // Update Token
    if (this.options.tokenRequired) {
      let token = getProp(loginResult, this.options.token.property)
      if (this.options.tokenType) {
        token = this.options.tokenType + ' ' + token
      }
      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    // Update clientId
    const clientId = getProp(loginResult, this.options.clientId)
    if (clientId) {
      this._setClientId(clientId)
    }

    // Fetch user
    if (this.options.autoFetchUser) {
      await this.fetchUser()
    }
  }

  async setUserToken (tokenValue) {
    const token = this.options.tokenType
      ? this.options.tokenType + ' ' + tokenValue
      : tokenValue
    this.$auth.setToken(this.name, token)
    this._setToken(token)

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
    user = getProp(user, this.options.user)

    this.$auth.setUser(user)
  }

  async logout (endpoint = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add client id to payload if enabled
      const clientId = this.options.dataClientId
      if (clientId) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[clientId] = this._getClientId()
      }

      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset () {
    if (this.options.tokenRequired) {
      this._clearToken()
    }

    this._setClientId(false)
    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)

    return Promise.resolve()
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization',
  token: {
    property: 'token',
    maxAge: 1800
  },
  user: 'user',
  clientId: 'client_id',
  dataClientId: 'client_id',
  clientIdPrefix: '_client_id.',
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
  autoFetchUser: true
}
