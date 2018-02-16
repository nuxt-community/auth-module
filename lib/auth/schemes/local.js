export default class LocalScheme {
  constructor (auth, options) {
    this.auth = auth
    this.options = Object.assign({ tokenRequired: true }, options)
  }

  mounted () {
    if (this.options.tokenRequired) {
      this.auth.syncToken()
    }
  }

  login (endpoint) {
    if (!this.options.endpoints.login) {
      return Promise.resolve()
    }

    this.auth.setStrategy(this.options._name)

    return this.auth.request(endpoint, this.options.endpoints.login)
      .then(data => {
        if (this.options.tokenRequired) {
          this.auth.setToken(data)
        }
      })
      .then(() => this.fetchUser())
  }

  fetchUser (endpoint) {
    // User endpoint is disabled. So we assueme loggedIn is true
    if (!this.options.endpoints.user) {
      this.auth.setState('loggedIn', true)
      return Promise.resolve()
    }

    // Token is required but not available
    if (this.options.tokenRequired && !this.auth.token) {
      return Promise.resolve()
    }

    // Try to fetch user and then set loggedIn to true
    return this.auth.request(endpoint, this.options.endpoints.user)
      .then(data => this.auth.setState('user', data))
      .then(() => this.auth.setState('loggedIn', true))
  }

  logout (endpoint) {
    if (!this.options.endpoints.logout) {
      return Promise.resolve()
    }

    return this.auth.request(endpoint, this.options.endpoints.logout)
      .catch(() => { })
  }
}
