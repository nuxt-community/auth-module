import { encodeQuery, parseQuery, ExpiredSessionError } from '../utilities'
import nanoid from 'nanoid'
import jwtDecode from 'jwt-decode'
const isHttps = process.server ? require('is-https') : null

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token',
  tokenName: 'Authorization'
}

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.$auth = auth
    this.req = auth.ctx.req
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

    if (process.server && this.req) {
      const protocol = 'http' + (isHttps(this.req) ? 's' : '') + '://'

      return protocol + this.req.headers.host + this.$auth.options.redirect.callback
    }

    if (process.client) {
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted () {
    // Sync tokens
    const token = this.$auth.syncToken(this.name)
    this.$auth.syncRefreshToken(this.name)

    // Set axios token
    if (token) {
      this._setToken(token)
      this.initializeTokenRefreshOnRequest()
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

  login ({ params, state, nonce } = {}) {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      access_type: this.options.access_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: state || nanoid(),
      ...params
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    // Set Nonce Value if response_type contains id_token to mitigate Replay Attacks
    // More Info: https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
    // More Info: https://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-06#section-4.6.2
    if (opts.response_type.includes('id_token')) {
      // nanoid auto-generates an URL Friendly, unique Cryptographic string
      // Recommended by Auth0 on https://auth0.com/docs/api-auth/tutorials/nonce
      opts.nonce = nonce || nanoid()
    }

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)

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
    // Handle callback only for specified route
    if (this.$auth.options.redirect && this.$auth.ctx.route.path !== this.$auth.options.redirect.callback) {
      return
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // accessToken/idToken
    let token = parsedQuery[this.options.token_key || 'access_token']
    // refresh token
    let refreshToken = parsedQuery[this.options.refresh_token_key || 'refresh_token']

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: process.server ? undefined : false,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          audience: this.options.audience,
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
  // Refresh tokens if token has expired
  // ---------------------------------------------------------------

  initializeTokenRefreshOnRequest () {
    const { $axios } = this.$auth.ctx.app
    let isRefreshing = false

    $axios.onRequest(async config => {
      let token = this.$auth.getToken(this.name)
      let refreshToken = this.$auth.getRefreshToken(this.name)

      // Token or "refresh token" does not exists
      if (!token || !refreshToken || !token.length || !refreshToken.length) {
        return config
      }

      // If already trying to refresh token, do not try again
      if (isRefreshing) {
        return config
      }

      // Time variables
      let tokenExpiresAt = jwtDecode(token).exp * 1000
      let refreshTokenExpiresAt = jwtDecode(refreshToken).exp * 1000
      const now = Date.now()

      // Give us some slack to help the token from expiring between validation and usage
      const timeSlackMillis = 500
      tokenExpiresAt -= timeSlackMillis
      refreshTokenExpiresAt -= timeSlackMillis


      // Return if token has not expired
      if (now < tokenExpiresAt) {
        return config
      }
      // "Refresh token" has also expired. There is no way to refresh. Force logout.
      if (now > refreshTokenExpiresAt) {
        this.logout()

        if(process.client) {
          // Explicitly redirect to the signed-out page.
          // We don't want to redirect a user with an expired token on page reload/first navigation.
          // WatchLoggedIn in auth.js->mounted redirects to logout when the state changes,
          // but it only works in the client
          this.$auth.redirect('logout')
        }
        // Stop the request from happening. The original caller must catch ExpiredSessionErrors
        throw new ExpiredSessionError()
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
