import defu from 'defu'
import { getProp, addTokenPrefix } from '../utilities'

export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = defu(options, DEFAULTS)
  }

  _setToken (token) {
    if (this.options.token.global) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.token.name, token)
    }
  }

  _clearToken () {
    if (this.options.token.global) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.token.name, false)
    }
  }

  mounted () {
    if (this.options.token.required) {
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
    await this.$auth.reset()

    const { response, result } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    if (this.options.token.required) {
      const token = addTokenPrefix(getProp(result, this.options.token.property), this.options.token.type)

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    if (this.options.autoFetchUser) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken (tokenValue) {
    const token = addTokenPrefix(getProp(tokenValue, this.options.token.property), this.options.token.type)
    this.$auth.setToken(this.name, token)
    this._setToken(token)

    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.token.required && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    let user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )
    user = getProp(user, this.options.user)

    this.$auth.setUser(user)
  }

  async logout (endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset () {
    if (this.options.token.required) {
      this._clearToken()
    }

    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)

    return Promise.resolve()
  }
}

const DEFAULTS = {
  token: {
    property: 'token',
    type: 'Bearer',
    name: 'Authorization',
    maxAge: 1800,
    global: true,
    required: true
  },
  user: 'user',
  autoFetchUser: true
}
