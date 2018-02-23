import ClientOAuth2 from 'client-oauth2'

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.auth = auth
    this.name = options._name

    // -- Assign defaults and normalize options --
    this.options = Object.assign({}, options)

    // Create new client instance
    this.client = new ClientOAuth2(this.options)
  }

  mounted () {
    // Sync token
    this.auth.syncToken(this.name)

    // Handle callbacks on page load
    if (process.client) {
      setTimeout(() => this._handleCallback().catch(() => {}), 1000)
    }
  }

  login (options) {
    // Login with Implicit grant

    // Open the page in a new window, then redirect back to a page that calls our global `oauth2Callback` function.
    window.location = this.client.token.getUri()
  }

  async fetchUser () {
    if (!this.auth.getToken(this.name)) {
      return
    }

    const user = await this.auth.requestWith(this.name, {
      url: this.options.userinfoUri
    })

    this.auth.setUser(user)
  }

  async _handleCallback (uri) {
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    const { accessToken } = await this.client.token.getToken(
      window.location.href
    )

    if (!accessToken) {
      return
    }

    this.auth.setToken(this.name, 'Bearer ' + accessToken)

    return this.fetchUser()
  }
}
