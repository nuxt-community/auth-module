import nanoid from 'nanoid'
import { encodeQuery } from '../utilities.js'
const isHttps = process.server ? require('is-https') : null

const DEFAULTS = {
  response_type: 'code',
  access_type: 'offline'
}

export default class Oauth2SessionScheme {
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

      return protocol + this.req.headers.host + this.options.redirect
    }

    if (process.client) {
      return window.location.origin + this.options.redirect
    }
  }

  async mounted () {
    // Handle callbacks on page load
    const redirected = await this._handleCallback()
    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  login ({ params, state } = {}) {
    const opts = {
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

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    window.location = url
  }

  async _handleCallback (uri) {
    // Handle callback only for redirect callback route
    if (this.$auth.ctx.route.path !== this.options.redirect) {
      return
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query)

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)

    if (state && parsedQuery.state !== state) {
      return
    }

    // -- Send code to backend --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: process.server ? undefined : false,
        withCredentials: true,
        data: encodeQuery({
          code: parsedQuery.code,
          response_type: this.options.response_type,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI
        })
      })
    }
    // Set local strategy
    this.$auth.setStrategy('local')

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
