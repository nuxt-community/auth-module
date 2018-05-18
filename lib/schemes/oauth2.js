import jwtDecode from 'jwt-decode'
import { encodeQuery, parseQuery, randomString } from '../utilities'

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token',
  tokenName: 'Authorization'
}

export default class Oauth2Scheme {
  constructor (auth, options) {
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

  async mounted () {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    // Set axios token
    if (token) {
      this._setToken(token)
      this.watchTokenExpiration()
    }

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  _setToken (token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken () {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
  }

  async logout () {
    this._clearToken()
    return this.$auth.reset()
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
    if (!this.$auth.getToken(this.name)) {
      return
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({})
      return
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })

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

    // accessToken/idToken
    let token = parsedQuery[this.options.token_key || 'access_token']

    // refresh token
    let refreshToken = parsedQuery[this.options.refresh_token_key || 'refresh_token']

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: false,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          grant_type: this.options.grant_type
        })
      })

      if (data.access_token) {
        token = data.access_token
      }

      if (data.refresh_token) {
        refreshToken = data.refresh_token
      }
    }

    if (!token || !token.length) {
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
      token = this.options.token_type + ' ' + token
    }

    // Store token
    this.$auth.setToken(this.name, token)

    // Set axios token
    this._setToken(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }

  // ---------------------------------------------------------------
  // Watch axios requests for token expiration
  // ---------------------------------------------------------------

  watchTokenExpiration () {
    const { $axios } = this.$auth.ctx.app
    let isRefreshing = false

    $axios.onRequest(async (config) => {
      // token and refresh token
      let token = this.$auth.getToken(this.name)
      let refreshToken = this.$auth.getRefreshToken(this.name)

      // token or "refresh token" does not exists
      if (!token || !refreshToken || !token.length || !refreshToken.length) {
        return config
      }

      // if already trying to refresh token, do not try again
      if (isRefreshing) {
        return config
      }

      // time variables
      const tokenExpiresAt = jwtDecode(token).exp * 1000
      const refreshTokenExpiresAt = jwtDecode(refreshToken).exp * 1000
      const now = Date.now()

      // token has not been expired
      if (now < tokenExpiresAt) {
        return config
      }

      // "refresh token" also has been expired. There is no way to refresh. Force logout.
      if (now > refreshTokenExpiresAt) {
        this.logout()
      }

      // Try to refresh token before processing current request
      isRefreshing = true

      return $axios.post(this.options.access_token_endpoint,
        encodeQuery({
          refresh_token: refreshToken.replace(this.options.token_type + ' ', ''),
          client_id: this.options.client_id,
          grant_type: 'refresh_token'
        })
      ).then(response => {
        // Change flag
        isRefreshing = false

        // Update token and "refresh token"
        token = this.options.token_type + ' ' + response.data.access_token
        refreshToken = this.options.token_type + ' ' + response.data.refresh_token

        this.$auth.setToken(this.name, token)
        this.$auth.setRefreshToken(this.name, refreshToken)
        $axios.setToken(token)

        // Update token for current request and process it
        config.headers['Authorization'] = token

        return Promise.resolve(config)
      })
    })
  }
}
