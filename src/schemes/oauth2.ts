import requrl from 'requrl'
import type {
  RefreshableScheme,
  SchemePartialOptions,
  SchemeCheck,
  RefreshableSchemeOptions,
  UserOptions,
  SchemeOptions,
  HTTPResponse,
  EndpointsOption,
  TokenableSchemeOptions
} from '../types'
import type { Auth } from '../core'
import {
  encodeQuery,
  getProp,
  normalizePath,
  parseQuery,
  removeTokenPrefix,
  urlJoin,
  randomString
} from '../utils'
import {
  RefreshController,
  RequestHandler,
  ExpiredAuthSessionError,
  Token,
  RefreshToken
} from '../inc'
import { BaseScheme } from './base'

export interface Oauth2SchemeEndpoints extends EndpointsOption {
  authorization: string
  token: string
  userInfo: string
  logout: string | false
}

export interface Oauth2SchemeOptions
  extends SchemeOptions,
    TokenableSchemeOptions,
    RefreshableSchemeOptions {
  endpoints: Oauth2SchemeEndpoints
  user: UserOptions
  responseMode: 'query.jwt' | 'fragment.jwt' | 'form_post.jwt' | 'jwt'
  responseType: 'code' | 'token' | 'id_token' | 'none' | string
  grantType:
    | 'implicit'
    | 'authorization_code'
    | 'client_credentials'
    | 'password'
    | 'refresh_token'
    | 'urn:ietf:params:oauth:grant-type:device_code'
  accessType: 'online' | 'offline'
  redirectUri: string
  logoutRedirectUri: string
  clientId: string | number
  scope: string | string[]
  state: string
  codeChallengeMethod: 'implicit' | 'S256' | 'plain'
  acrValues: string
  audience: string
  autoLogout: boolean
}

const DEFAULTS: SchemePartialOptions<Oauth2SchemeOptions> = {
  name: 'oauth2',
  accessType: null,
  redirectUri: null,
  logoutRedirectUri: null,
  clientId: null,
  audience: null,
  grantType: null,
  responseMode: null,
  acrValues: null,
  autoLogout: false,
  endpoints: {
    logout: null,
    authorization: null,
    token: null,
    userInfo: null
  },
  scope: [],
  token: {
    property: 'access_token',
    type: 'Bearer',
    name: 'Authorization',
    maxAge: 1800,
    global: true,
    prefix: '_token.',
    expirationPrefix: '_token_expiration.'
  },
  refreshToken: {
    property: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30,
    prefix: '_refresh_token.',
    expirationPrefix: '_refresh_token_expiration.'
  },
  user: {
    property: false
  },
  responseType: 'token',
  codeChallengeMethod: 'implicit'
}

export class Oauth2Scheme<
    OptionsT extends Oauth2SchemeOptions = Oauth2SchemeOptions
  >
  extends BaseScheme<OptionsT>
  implements RefreshableScheme {
  public req
  public token: Token
  public refreshToken: RefreshToken
  public refreshController: RefreshController
  public requestHandler: RequestHandler

  constructor(
    $auth: Auth,
    options: SchemePartialOptions<Oauth2SchemeOptions>,
    ...defaults: SchemePartialOptions<Oauth2SchemeOptions>[]
  ) {
    super(
      $auth,
      options as OptionsT,
      ...(defaults as OptionsT[]),
      DEFAULTS as OptionsT
    )

    this.req = $auth.ctx.req

    // Initialize Token instance
    this.token = new Token(this, this.$auth.$storage)

    // Initialize Refresh Token instance
    this.refreshToken = new RefreshToken(this, this.$auth.$storage)

    // Initialize Refresh Controller
    this.refreshController = new RefreshController(this)

    // Initialize Request Handler
    this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios)
  }

  protected get scope(): string {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  protected get redirectURI(): string {
    const basePath = this.$auth.ctx.base || ''
    const path = normalizePath(
      basePath + '/' + this.$auth.options.redirect.callback
    ) // Don't pass in context since we want the base path
    return this.options.redirectUri || urlJoin(requrl(this.req), path)
  }

  protected get logoutRedirectURI(): string {
    return (
      this.options.logoutRedirectUri ||
      urlJoin(requrl(this.req), this.$auth.options.redirect.logout)
    )
  }

  check(checkStatus = false): SchemeCheck {
    const response = {
      valid: false,
      tokenExpired: false,
      refreshTokenExpired: false,
      isRefreshable: true
    }

    // Sync tokens
    const token = this.token.sync()
    this.refreshToken.sync()

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

    // Refresh token has expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      response.refreshTokenExpired = true
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

  async mounted(): Promise<HTTPResponse | void> {
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

  reset(): void {
    this.$auth.setUser(false)
    this.token.reset()
    this.refreshToken.reset()
    this.requestHandler.reset()
  }

  async login(
    _opts: { state?: string; params?; nonce?: string } = {}
  ): Promise<void> {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.responseType,
      access_type: this.options.accessType,
      client_id: this.options.clientId,
      redirect_uri: this.redirectURI,
      scope: this.scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: _opts.state || randomString(10),
      code_challenge_method: this.options.codeChallengeMethod,
      ..._opts.params
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    // Set Nonce Value if response_type contains id_token to mitigate Replay Attacks
    // More Info: https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
    // More Info: https://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-06#section-4.6.2
    if (opts.response_type.includes('token')) {
      opts.nonce = _opts.nonce || randomString(10)
    }

    if (opts.code_challenge_method) {
      switch (opts.code_challenge_method) {
        case 'plain':
        case 'S256':
          {
            const state = this.generateRandomString()
            this.$auth.$storage.setUniversal(this.name + '.pkce_state', state)
            const codeVerifier = this.generateRandomString()
            this.$auth.$storage.setUniversal(
              this.name + '.pkce_code_verifier',
              codeVerifier
            )
            const codeChallenge = await this.pkceChallengeFromVerifier(
              codeVerifier,
              opts.code_challenge_method === 'S256'
            )
            opts.code_challenge = window.encodeURIComponent(codeChallenge)
          }
          break
        case 'implicit':
        default:
          break
      }
    }

    if (this.options.responseMode) {
      opts.response_mode = this.options.responseMode
    }

    if (this.options.acrValues) {
      opts.acr_values = this.options.acrValues
    }

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)

    const url = this.options.endpoints.authorization + '?' + encodeQuery(opts)

    window.location.replace(url)
  }

  logout(): void {
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId + '',
        logout_uri: this.logoutRedirectURI
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
    return this.$auth.reset()
  }

  async fetchUser(): Promise<void> {
    if (!this.check().valid) {
      return
    }

    if (!this.options.endpoints.userInfo) {
      this.$auth.setUser({})
      return
    }

    const response = await this.$auth.requestWith(this.name, {
      url: this.options.endpoints.userInfo
    })

    this.$auth.setUser(getProp(response.data, this.options.user.property))
  }

  async _handleCallback(): Promise<boolean | void> {
    // Handle callback only for specified route
    if (
      this.$auth.options.redirect &&
      normalizePath(this.$auth.ctx.route.path, this.$auth.ctx) !==
        normalizePath(this.$auth.options.redirect.callback, this.$auth.ctx)
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
    let token: string = parsedQuery[this.options.token.property] as string
    // refresh token
    let refreshToken: string

    if (this.options.refreshToken.property) {
      refreshToken = parsedQuery[this.options.refreshToken.property] as string
    }

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
          code: parsedQuery.code as string,
          client_id: this.options.clientId + '',
          redirect_uri: this.redirectURI,
          response_type: this.options.responseType,
          audience: this.options.audience,
          grant_type: this.options.grantType,
          code_verifier: codeVerifier
        })
      })

      token =
        (getProp(response.data, this.options.token.property) as string) || token
      refreshToken =
        (getProp(
          response.data,
          this.options.refreshToken.property
        ) as string) || refreshToken
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

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }

  async refreshTokens(): Promise<HTTPResponse | void> {
    // Get refresh token
    const refreshToken = this.refreshToken.get()

    // Refresh token is required but not available
    if (!refreshToken) {
      return
    }

    // Get refresh token status
    const refreshTokenStatus = this.refreshToken.status()

    // Refresh token is expired. There is no way to refresh. Force reset.
    if (refreshTokenStatus.expired()) {
      this.$auth.reset()

      throw new ExpiredAuthSessionError()
    }

    // Delete current token from the request header before refreshing
    this.requestHandler.clearHeader()

    const response = await this.$auth
      .request({
        method: 'post',
        url: this.options.endpoints.token,
        baseURL: '',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeQuery({
          refresh_token: removeTokenPrefix(
            refreshToken,
            this.options.token.type
          ),
          client_id: this.options.clientId + '',
          grant_type: 'refresh_token'
        })
      })
      .catch((error) => {
        this.$auth.callOnError(error, { method: 'refreshToken' })
        return Promise.reject(error)
      })

    this.updateTokens(response)

    return response
  }

  protected updateTokens(response: HTTPResponse): void {
    const token = getProp(response.data, this.options.token.property) as string
    const refreshToken = getProp(
      response.data,
      this.options.refreshToken.property
    ) as string

    this.token.set(token)

    if (refreshToken) {
      this.refreshToken.set(refreshToken)
    }
  }

  protected async pkceChallengeFromVerifier(
    v: string,
    hashValue: boolean
  ): Promise<string> {
    if (hashValue) {
      const hashed = await this._sha256(v)
      return this._base64UrlEncode(hashed)
    }
    return v // plain is plain - url-encoded by default
  }

  protected generateRandomString(): string {
    const array = new Uint32Array(28) // this is of minimum required length for servers with PKCE-enabled
    window.crypto.getRandomValues(array)
    return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join(
      ''
    )
  }

  private _sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  private _base64UrlEncode(str: ArrayBuffer): string {
    // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}
