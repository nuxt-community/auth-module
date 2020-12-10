import { getResponseProp } from '../../utils'
import Token from '../../inc/token'
import RequestHandler from '../../inc/request-handler'
import { HTTPRequest, HTTPResponse } from '../../index'
import SchemeCheck from '../contracts/SchemeCheck'
import BaseScheme from '../_scheme'
import TokenableScheme from '../TokenableScheme'
import SchemePartialOptions from '../contracts/SchemePartialOptions'
import Auth from '../../core/auth'
import LocalSchemeOptions from './contracts/LocalSchemeOptions'

const DEFAULTS: SchemePartialOptions<LocalSchemeOptions> = {
  name: 'local',
  endpoints: {
    login: {
      url: '/api/auth/login',
      method: 'post'
    },
    logout: {
      url: '/api/auth/logout',
      method: 'post'
    },
    user: {
      url: '/api/auth/user',
      method: 'get'
    }
  },
  token: {
    property: 'token',
    type: 'Bearer',
    name: 'Authorization',
    maxAge: 1800,
    global: true,
    required: true,
    prefix: '_token.',
    expirationPrefix: '_token_expiration.'
  },
  user: {
    property: 'user',
    autoFetch: true
  },
  clientId: false,
  grantType: false,
  scope: false
}

export default class LocalScheme<
    OptionsT extends LocalSchemeOptions = LocalSchemeOptions
  >
  extends BaseScheme<OptionsT>
  implements TokenableScheme<OptionsT> {
  public token: Token
  public requestHandler: RequestHandler

  constructor(
    $auth: Auth,
    options: SchemePartialOptions<LocalSchemeOptions>,
    ...defaults: SchemePartialOptions<LocalSchemeOptions>[]
  ) {
    super(
      $auth,
      options as OptionsT,
      ...(defaults as OptionsT[]),
      DEFAULTS as OptionsT
    )

    // Initialize Token instance
    this.token = new Token(this, this.$auth.$storage)

    // Initialize Request Interceptor
    this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios)
  }

  check(checkStatus = false): SchemeCheck {
    const response = {
      valid: false,
      tokenExpired: false
    }

    // Sync token
    const token = this.token.sync()

    // Token is required but not available
    if (this.options.token.required && !token) {
      return response
    }

    // Check status wasn't enabled, let it pass
    if (!checkStatus) {
      response.valid = true
      return response
    }

    // Get status
    const tokenStatus = this.token.status()

    // Token has expired. Attempt `tokenCallback`
    if (tokenStatus.expired()) {
      response.tokenExpired = true
      return response
    }

    response.valid = true
    return response
  }

  mounted({
    tokenCallback = () => this.$auth.reset(),
    refreshTokenCallback = undefined
  } = {}): Promise<HTTPResponse> {
    const { tokenExpired, refreshTokenExpired } = this.check(true)

    if (refreshTokenExpired && typeof refreshTokenCallback === 'function') {
      refreshTokenCallback()
    } else if (tokenExpired && typeof tokenCallback === 'function') {
      tokenCallback()
    }

    // Initialize request interceptor
    this.initializeRequestInterceptor()

    // Fetch user once
    return this.$auth.fetchUserOnce()
  }

  async login(
    endpoint: HTTPRequest,
    { reset = true } = {}
  ): Promise<HTTPResponse> {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    if (reset) {
      this.$auth.reset({ resetInterceptor: false })
    }

    // Add client id to payload if defined
    if (this.options.clientId) {
      endpoint.data.client_id = this.options.clientId
    }

    // Add grant type to payload if defined
    if (this.options.grantType) {
      endpoint.data.grant_type = this.options.grantType
    }

    // Add scope to payload if defined
    if (this.options.scope) {
      endpoint.data.scope = this.options.scope
    }

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update tokens
    this.updateTokens(response)

    // Initialize request interceptor if not initialized
    if (!this.requestHandler.interceptor) {
      this.initializeRequestInterceptor()
    }

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken(token: string): Promise<HTTPResponse | void> {
    this.token.set(token)

    // Fetch user
    return this.fetchUser()
  }

  async fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void> {
    // Token is required but not available
    if (!this.check().valid) {
      return
    }

    // User endpoint is disabled
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    return this.$auth
      .requestWith(this.name, endpoint, this.options.endpoints.user)
      .then((response) => {
        this.$auth.setUser(
          getResponseProp(response, this.options.user.property)
        )
        return response
      })
      .catch((error) => {
        this.$auth.callOnError(error, { method: 'fetchUser' })
      })
  }

  async logout(endpoint: HTTPRequest = {}): Promise<void> {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {
          //
        })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  reset({ resetInterceptor = true } = {}): void {
    this.$auth.setUser(false)
    this.token.reset()

    if (resetInterceptor) {
      this.requestHandler.reset()
    }
  }

  protected updateTokens(response: HTTPResponse): void {
    if (this.options.token.required) {
      const token = getResponseProp(response, this.options.token.property)
      this.token.set(token)
    }
  }

  protected initializeRequestInterceptor(): void {
    this.requestHandler.initializeRequestInterceptor()
  }
}
