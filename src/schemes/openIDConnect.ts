import { AxiosResponse } from 'axios'
import {
  encodeQuery,
  parseQuery,
  normalizePath,
  getResponseProp
} from '../utils'
import IdToken from '../inc/id-token'
import ConfigurationDocument from '../inc/configuration-document'
import type { SchemeCheck } from '../index'
import Oauth2Scheme from './oauth2'

const DEFAULTS = {
  name: 'openIDConnect',
  idToken: {
    property: 'id_token',
    maxAge: 60 * 60 * 24 * 30,
    prefix: '_id_token.',
    expirationPrefix: '_id_token_expiration.'
  },
  codeChallengeMethod: 'S256'
}

export default class OpenIDConnectScheme extends Oauth2Scheme<typeof DEFAULTS> {
  public idToken: IdToken
  public configurationDocument: ConfigurationDocument

  constructor($auth: any, options: any, ...defaults: any) {
    super($auth, options, ...defaults, DEFAULTS)

    this.idToken = new IdToken(this, this.$auth.$storage)
    this.configurationDocument = new ConfigurationDocument(
      this,
      this.$auth.$storage
    )
  }

  _updateTokens(response: AxiosResponse<any>) {
    const token = getResponseProp(response, this.options.token.property)
    const refreshToken = getResponseProp(
      response,
      this.options.refreshToken.property
    )

    const idToken = getResponseProp(response, this.options.idToken.property)

    this.token.set(token)

    if (refreshToken) {
      this.refreshToken.set(refreshToken)
    }

    if (idToken) {
      this.idToken.set(idToken)
    }
  }

  check(checkStatus = false): SchemeCheck {
    const response: SchemeCheck = {
      valid: false,
      tokenExpired: false,
      refreshTokenExpired: false,
      idTokenExpired: false,
      isRefreshable: true
    }

    // Sync tokens
    const token = this.token.sync()
    this.refreshToken.sync()
    this.idToken.sync()

    // Token is required but not available
    if (!token) {
      return response
    }

    // Check status wasn't enabled, let it pass
    if (!checkStatus) {
      response.valid = true
      return response
    }

    // Get status
    const tokenStatus = this.token.status()
    const refreshTokenStatus = this.refreshToken.status()
    const idTokenStatus = this.idToken.status()

    // Refresh token has expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      response.refreshTokenExpired = true
      return response
    }

    // Id token has expired. Force reset.
    if (idTokenStatus.expired()) {
      response.idTokenExpired = true
      return response
    }

    // Token has expired, Force reset.
    if (tokenStatus.expired()) {
      response.tokenExpired = true
      return response
    }

    response.valid = true
    return response
  }

  async mounted() {
    // Get and validate configuration based upon OpenIDConnect Configuration document
    // https://openid.net/specs/openid-connect-configuration-1_0.html
    await this.configurationDocument.init()

    const { tokenExpired, refreshTokenExpired } = this.check(true)

    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (refreshTokenExpired || (tokenExpired && this.options.autoLogout)) {
      this.$auth.reset()
    }

    // Initialize request interceptor
    this.requestHandler.initializeRequestInterceptor(
      this.options.endpoints.token
    )

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  reset() {
    this.$auth.setUser(false)
    this.token.reset()
    this.idToken.reset()
    this.refreshToken.reset()
    this.requestHandler.reset()
    this.configurationDocument.reset()
  }

  logout() {
    if (this.options.endpoints.logout) {
      const opts = {
        id_token_hint: this.idToken.get(),
        post_logout_redirect_uri: this._logoutRedirectURI
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
    return this.$auth.reset()
  }

  async fetchUser() {
    if (!this.check().valid) {
      return
    }

    if (this.idToken.get()) {
      const data = this.idToken.userInfo()
      this.$auth.setUser(data)
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

  async _handleCallback() {
    // Handle callback only for specified route
    if (
      this.$auth.options.redirect &&
      normalizePath(this.$auth.ctx.route.path) !==
        normalizePath(this.$auth.options.redirect.callback)
    ) {
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
    // id token
    let idToken = parsedQuery[this.options.idToken.property]

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // -- Authorization Code Grant --
    if (this.options.responseType === 'code' && parsedQuery.code) {
      let codeVerifier

      // Retrieve code verifier and remove it from storage
      if (
        this.options.codeChallengeMethod &&
        this.options.codeChallengeMethod !== 'implicit'
      ) {
        codeVerifier = this.$auth.$storage.getUniversal(
          this.name + '.pkce_code_verifier'
        )
        this.$auth.$storage.setUniversal(
          this.name + '.pkce_code_verifier',
          null
        )
      }

      const response = await this.$auth.request({
        method: 'post',
        url: this.options.endpoints.token,
        baseURL: '',
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.clientId,
          redirect_uri: this._redirectURI,
          response_type: this.options.responseType,
          audience: this.options.audience,
          grant_type: this.options.grantType,
          code_verifier: codeVerifier
        })
      })

      token = getResponseProp(response, this.options.token.property) || token
      refreshToken =
        getResponseProp(response, this.options.refreshToken.property) ||
        refreshToken
      idToken =
        // @ts-ignore
        getResponseProp(response, this.options.idToken.property) || idToken
    }

    if (!token || !token.length) {
      return
    }

    // Set token
    this.token.set(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      this.refreshToken.set(refreshToken)
    }

    if (idToken && idToken.length) {
      this.idToken.set(idToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
