import { encodeQuery, parseQuery, randomString } from '../utilities'

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token'
}

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
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
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
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

    if (!this.options.userinfo_endpoint) {
      this.auth.setUser({})
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

    // Parse query from both search and hash fragments
    const hash = parseQuery(window.location.hash.substr(1))
    const search = parseQuery(window.location.search.substr(1))
    const parsedQuery = Object.assign({}, search, hash)

    // accessToken
    let accessToken = parsedQuery.access_token

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.auth.request({
        method: 'post',
        url: window.location.origin + this.options.access_token_endpoint,
        data: {
          code: parsedQuery.code
        }
      })

      if (data.access_token) {
        accessToken = data.access_token
      }
    }

    if (!accessToken || !accessToken.length) {
      return
    }

    // Validate state
    const state = this.auth.getLocalStorage(this.name + '.state')
    this.auth.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // Append token_type
    if (this.options.token_type) {
      accessToken = this.options.token_type + ' ' + accessToken
    }

    // Store token
    this.auth.setToken(this.name, accessToken)

    // Redirect to home
    this.auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
