import { nanoid } from 'nanoid'
import requrl from 'requrl'
import { encodeQuery, parseQuery, normalizePath, getResponseProp, urlJoin } from '../utils'
import RefreshController from '../inc/refresh-controller'
import RequestHandler from '../inc/request-handler'
import ExpiredAuthSessionError from '../inc/expired-auth-session-error'
import BaseScheme from './_scheme'

const DEFAULTS = {
  name: 'oauth2',
  accessType: null,
  redirectUri: null,
  logoutRedirectUri: null,
  clientId: null,
  audience: null,
  grantType: null,
  autoLogout: false,
  endpoints: {
    logout: '',
    authorization: '',
    token: '',
    userInfo: ''
  },
  scope: [],
  token: {
    property: 'access_token',
    type: 'Bearer',
    name: 'Authorization',
    maxAge: 1800,
    global: true
  },
  refreshToken: {
    property: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30
  },
  responseType: 'token'
}

export default class Oauth2Scheme extends BaseScheme<typeof DEFAULTS> {
  public req
  public name
  public refreshController: RefreshController
  public requestHandler: RequestHandler

  constructor ($auth, options) {
    super($auth, options, DEFAULTS)

    this.req = $auth.ctx.req

    this.refreshController = new RefreshController(this)
    this.requestHandler = new RequestHandler(this.$auth)
  }

  get _scope () {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI () {
    return this.options.redirectUri || urlJoin(requrl(this.req), this.$auth.options.redirect.callback)
  }

  get _logoutRedirectURI () {
    return this.options.logoutRedirectUri || urlJoin(requrl(this.req), this.$auth.options.redirect.logout)
  }

  async mounted () {
    // Sync tokens
    this.$auth.token.sync()
    this.$auth.refreshToken.sync()

    // Get token and refresh token status
    const tokenStatus = this.$auth.token.status()
    const refreshTokenStatus = this.$auth.refreshToken.status()

    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (refreshTokenStatus.expired()) {
      await this.$auth.reset()
    } else if (this.options.autoLogout && tokenStatus.expired()) {
      await this.$auth.reset()
    }

    // Initialize request interceptor
    this.refreshController.initializeRequestInterceptor(this.options.endpoints.token)

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  check () {
    return !!this.$auth.token.get()
  }

  async reset () {
    this.$auth.setUser(false)
    this.$auth.token.reset()
    this.$auth.refreshToken.reset()

    return Promise.resolve()
  }

  login (_opts: { state?, params?, nonce? } = {}) {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.responseType,
      access_type: this.options.accessType,
      client_id: this.options.clientId,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: _opts.state || nanoid(),
      ..._opts.params
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
      opts.nonce = _opts.nonce || nanoid()
    }

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)

    const url = this.options.endpoints.authorization + '?' + encodeQuery(opts)

    window.location.replace(url)
  }

  logout () {
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId,
        logout_uri: this._logoutRedirectURI
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
    return this.$auth.reset()
  }

  async fetchUser () {
    if (!this.check()) {
      return
    }

    if (!this.options.endpoints.userInfo) {
      this.$auth.setUser({})
      return
    }

    const { data } = await this.$auth.requestWith(this.name, {
      url: this.options.endpoints.userInfo
    })

    this.$auth.setUser(data)
  }

  async _handleCallback () {
    // Handle callback only for specified route
    if (this.$auth.options.redirect && normalizePath(this.$auth.ctx.route.path) !== normalizePath(this.$auth.options.redirect.callback)) {
      return
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // accessToken/idToken
    let token = parsedQuery[this.options.token.property]
    // refresh token
    let refreshToken = parsedQuery[this.options.refreshToken.property]

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // -- Authorization Code Grant --
    if (this.options.responseType === 'code' && parsedQuery.code) {
      const response = await this.$auth.request({
        method: 'post',
        url: this.options.endpoints.token,
        baseURL: process.server ? undefined : false,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.clientId,
          redirect_uri: this._redirectURI,
          response_type: this.options.responseType,
          audience: this.options.audience,
          grant_type: this.options.grantType
        })
      })

      token = getResponseProp(response, this.options.token.property) || token
      refreshToken = getResponseProp(response, this.options.refreshToken.property) || refreshToken
    }

    if (!token || !token.length) {
      return
    }

    // Set token
    this.$auth.token.set(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      this.$auth.refreshToken.set(refreshToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }

  async refreshTokens () {
    // Get refresh token
    const refreshToken = this.$auth.refreshToken.get()

    // Refresh token is required but not available
    if (!refreshToken) { return }

    // Get refresh token status
    const refreshTokenStatus = this.$auth.refreshToken.status()

    // Refresh token is expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      await this.$auth.reset()

      throw new ExpiredAuthSessionError()
    }

    // Delete current token from the request header before refreshing
    this.requestHandler.clearHeader()

    const response = await this.$auth.request(this.name, {
      method: 'post',
      url: this.options.endpoints.token,
      data: encodeQuery({
        refresh_token: refreshToken.replace(this.$auth.options.token.type + ' ', ''),
        client_id: this.options.clientId,
        grant_type: 'refresh_token'
      })
    })

    const newToken = getResponseProp(response, this.options.token.property)
    const newRefreshToken = getResponseProp(response, this.options.refreshToken.property)

    // Update tokens
    this.$auth.token.set(newToken)

    if (newRefreshToken) {
      this.$auth.refreshToken.set(newRefreshToken)
    }

    return response
  }
}
