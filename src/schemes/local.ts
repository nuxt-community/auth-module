import type { AxiosRequestConfig } from 'axios'
import { getProp, getResponseProp } from '../utils'
import Token from '../inc/token'
import RequestHandler from '../inc/request-handler'
import type { SchemeOptions } from '../'
import BaseScheme from './_scheme'

const DEFAULTS: SchemeOptions = {
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
  grantType: false
}

export default class LocalScheme extends BaseScheme<typeof DEFAULTS> {
  public token: Token
  public requestHandler: RequestHandler

  constructor ($auth, options, ...defaults) {
    super($auth, options, ...defaults, DEFAULTS)

    // Initialize Token instance
    this.token = new Token(this, this.$auth.$storage)

    // Initialize Request Interceptor
    this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios)
  }

  _updateTokens (response) {
    if (this.options.token.required) {
      const token = getResponseProp(response, this.options.token.property)
      this.token.set(token)
    }
  }

  check (checkStatus = false, tokenCallback?, _refreshTokenCallback?) {
    // Sync token
    const token = this.token.sync()

    // Token is required but not available
    if (this.options.token.required && !token) {
      return false
    }

    // Check status wasn't enabled, let it pass
    if (!checkStatus) {
      return true
    }

    // Get status
    const tokenStatus = this.token.status()

    // Token has expired. Attempt `tokenCallback`
    if (tokenStatus.expired()) {
      if (typeof tokenCallback === 'function') {
        return tokenCallback(false) || false
      }

      return false
    }

    return true
  }

  mounted ({
    refreshEndpoint = undefined,
    tokenCallback = () => this.$auth.reset(),
    refreshTokenCallback = undefined
  } = {}) {
    this.check(true, tokenCallback, refreshTokenCallback)

    // Initialize request interceptor
    this.requestHandler.initializeRequestInterceptor(refreshEndpoint)

    // Fetch user once
    return this.$auth.fetchUserOnce()
  }

  async login (endpoint, { reset = true, refreshEndpoint = undefined } = {}) {
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

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update tokens
    this._updateTokens(response)

    // Initialize request interceptor if not initialized
    if (!this.requestHandler.interceptor) {
      this.requestHandler.initializeRequestInterceptor(refreshEndpoint)
    }

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken (tokenValue) {
    this.token.set(getProp(tokenValue, this.options.token.property))

    // Fetch user
    return this.fetchUser()
  }

  async fetchUser (endpoint?) {
    // Token is required but not available
    if (!this.check()) {
      return
    }

    // User endpoint is disabled
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      this.$auth.setUser(getResponseProp(response, this.options.user.property))
      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })
  }

  async logout (endpoint: AxiosRequestConfig = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {
        })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  reset ({ resetInterceptor = true } = {}) {
    this.$auth.setUser(false)
    this.token.reset()

    if (resetInterceptor) {
      this.requestHandler.reset()
    }
  }
}
