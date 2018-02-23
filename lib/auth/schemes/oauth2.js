import { encodeQuery, parseQuery, randomString } from '../utilities'

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.auth = auth
    this.name = options._name

    this.options = Object.assign({}, options)
  }

  get _scope () {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI () {
    const url = this.options.redirect_uri

    if (url) {
      return url
    }

    if (process.browser) {
      return window.location.origin + this.auth.options.redirect.callback
    }
  }

  async mounted () {
    // Sync token
    this.auth.syncToken(this.name)

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.auth.fetchUserOnce()
    }
  }

  login () {
    // Login with Implicit grant
    this._implicitGrantLogin()
  }

  _implicitGrantLogin () {
    const opts = {
      protocol: 'oauth2',
      response_type: 'token',
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      state: randomString()
    }

    this.auth.setLocalStorage(this.name + '.state', opts.state)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    window.location = url
  }

  async fetchUser () {
    if (!this.auth.getToken(this.name)) {
      return
    }

    const user = await this.auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })

    this.auth.setUser(user)
  }

  async _handleCallback (uri) {
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    // Parse query
    const hash = window.location.hash.substr(1)
    const parsedQuery = parseQuery(hash)

    if (!parsedQuery.access_token) {
      return
    }

    // Validate state
    const state = this.auth.getLocalStorage(this.name + '.state')
    this.auth.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // Token provided
    this.auth.setToken(this.name, 'Bearer ' + parsedQuery.access_token)

    // Redirect to home
    this.auth.redirect('home', true)

    return true // Means redirect happened
  }
}
