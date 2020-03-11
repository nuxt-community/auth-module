import { encodeQuery, parseQuery } from '../utilities'
import nanoid from 'nanoid'
import defu from 'defu'
const isHttps = process.server ? require('is-https') : null

const DEFAULTS = {
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
  response_type: 'token'
}

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.$auth = auth
    this.req = auth.ctx.req
    this.name = options._name

    this.options = defu(options, DEFAULTS)
    this.options.token.property = this.options.token_key || this.options.token.property
    this.options.token.type = this.options.token_type || this.options.token.type
    this.options.refreshToken.property = this.options.refresh_token_key || this.options.refreshToken.property
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
    // Sync token
    this.$auth.syncToken()

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  async reset () {
    this.$auth.setUser(false)
    this.$auth.resetToken()
    this.$auth.resetRefreshToken()

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

    // Set token
    this.$auth.setToken(token, this.options.token.type)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      this.$auth.setRefreshToken(token, this.options.token.type)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
