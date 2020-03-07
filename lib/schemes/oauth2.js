import { encodeQuery, parseQuery, RefreshController, TokenExpirationStatus } from '../utilities'
import ExpiredAuthSessionError from '../includes/ExpiredAuthSessionError'
import nanoid from 'nanoid'

const isHttps = process.server ? require('is-https') : null

const DEFAULTS = {
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

  async reset () {
    this._clearToken()

    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)

    return Promise.resolve()
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

    // Add token_type prefix
    token = this.$auth.addTokenPrefix(token)
    // Store token
    this.$auth.setToken(this.name, token)

    // Set axios token
    this._setToken(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.$auth.addTokenPrefix(refreshToken)
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
    const refreshController = new RefreshController(this)

    $axios.onRequest(async config => {
      // Don't intercept token requests
      if (config.url === this.options.access_token_endpoint) {
        return config
      }

      const token = this.$auth.getToken(this.name)
      const refreshToken = this.$auth.getRefreshToken(this.name)

      // Token or "refresh token" does not exist
      if (!token || !refreshToken) {
        // The authorization header in the current request is expired.
        // Token was deleted right before this request
        if (this.requestHasAuthorizationHeader(config)) {
          throw new ExpiredAuthSessionError()
        }

        return config
      }

      // Check token expiration
      const tokenStatus = new TokenExpirationStatus(this)

      // Token is still valid, let the request pass
      if (tokenStatus.valid() || tokenStatus.unknown()) {
        return config
      }

      // Refresh token has also expired. There is no way to refresh. Force reset.
      if (tokenStatus.refreshExpired()) {
        await this.$auth.reset()

        // Stop the request from happening. The original caller should catch ExpiredAuthSessionErrors
        throw new ExpiredAuthSessionError()
      }

      // Refresh token before sending current request
      await refreshController.handleRefresh()

      // Fetch updated token and add to current request
      return this.getUpdatedRequestConfig(config)
    })
  }

  getUpdatedRequestConfig (config) {
    config.headers[this.options.tokenName] = this.$auth.getToken(this.name)
    return config
  }

  requestHasAuthorizationHeader (config) {
    return !!config.headers.common[this.options.tokenName]
  }

  async refreshTokens () {
    const refreshToken = this.$auth.getRefreshToken(this.name)

    // Delete current token from the request header before refreshing
    this._clearToken()

    const { response, result } = await this.$auth.requestWith(this.name, {
      method: 'post',
      url: this.options.access_token_endpoint,
      data: encodeQuery({
        refresh_token: refreshToken.replace(this.$auth.options.token_type + ' ', ''),
        client_id: this.options.client_id,
        grant_type: 'refresh_token'
      })
    }, false, true)

    const newToken = this.$auth.addTokenPrefix(result.access_token)
    const newRefreshToken = this.$auth.addTokenPrefix(result.refresh_token)

    // Store tokens
    this.$auth.setToken(this.name, newToken)
    this.$auth.setRefreshToken(this.name, newRefreshToken)

    // Update authorization header
    this._setToken(newToken)
  }
}
