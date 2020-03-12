import defu from 'defu'
import { getProp } from '../utilities'

export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = defu(options, DEFAULTS)
  }

  mounted () {
    if (this.options.token.required) {
      this.$auth.syncToken()
    }

    return this.$auth.fetchUserOnce()
  }

  async login (endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    const { response, data } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    if (this.options.token.required) {
      this.$auth.setToken(getProp(data, this.options.token.property))
    }

    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken (tokenValue) {
    this.$auth.setToken(getProp(tokenValue, this.options.token.property))

    return this.fetchUser()
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.token.required && !this.$auth.getToken()) {
      return
    }

    // User endpoint is disabled.
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
    this.$auth.setUser(false)
    this.$auth.resetToken()
    this.$auth.resetRefreshToken()

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
  user: {
    property: 'user',
    autoFetch: true
  }
}
