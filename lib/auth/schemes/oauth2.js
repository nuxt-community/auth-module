import { encodeQuery, parseQuery, randomString } from '../utilities'
import jwtDecode from 'jwt-decode'

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token'
}

export default class Oauth2Scheme {
  constructor(auth, options) {
    this.$auth = auth
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
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  _setToken (token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setToken(token, this.options.tokenType)
  }

  _clearToken () {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setToken(false)
  }

  async mounted () {
    // Sync token    
    const token = this.$auth.syncToken(this.name)
    this._setToken(token)

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
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

    this.$auth.$storage.setLocalStorage(this.name + '.state', opts.state)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    window.location = url
  }

  async fetchUser () {
    const token = this.$auth.getToken(this.name)

    if (!token) {
      return
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({})
      return
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })

    if (this.options.decode_resource_access === true) {
      const decodedToken = jwtDecode(token)
      user.resource_access = decodedToken.resource_access
    }

    this.$auth.setUser(user)
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

    // refresh token
    let refreshToken = parsedQuery.refresh_token

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          grant_type: this.options.grant_type
        })
      })

      if (data.access_token) {
        accessToken = data.access_token
      }

      if (data.refresh_token) {
        refreshToken = data.refresh_token
      }
    }

    if (!accessToken || !accessToken.length) {
      return
    }

    // Validate state
    const state = this.$auth.$storage.getLocalStorage(this.name + '.state')
    this.$auth.$storage.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // Append token_type
    if (this.options.token_type) {
      accessToken = this.options.token_type + ' ' + accessToken
    }

    // Store token
    this.$auth.setToken(this.name, accessToken)
    this._setToken(accessToken)


    // Store refresh Token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
