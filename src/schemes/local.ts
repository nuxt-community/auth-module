import { getProp, getResponseProp } from '../utils'
import RequestHandler from '../inc/request-handler'
import { SchemeOptions, HTTPRequest } from '../types'
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
    required: true
  },
  user: {
    property: 'user',
    autoFetch: true
  },
  clientId: {
    property: 'client_id',
    data: 'client_id',
    prefix: '_client_id.'
  }
}

export default class LocalScheme extends BaseScheme<typeof DEFAULTS> {
  requestHandler: RequestHandler

  constructor ($auth, options, ...defaults) {
    super($auth, options, ...defaults, DEFAULTS)

    // Initialize Request Interceptor
    this.requestHandler = new RequestHandler(this.$auth)
  }

  _getClientId () {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.getUniversal(_key)
  }

  _setClientId (clientId) {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.setUniversal(_key, clientId)
  }

  _syncClientId () {
    const _key = this.options.clientId.prefix + this.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  mounted () {
    if (this.options.token.required) {
      // Sync token
      this.$auth.token.sync()

      // Get token status
      const tokenStatus = this.$auth.token.status()

      // Token is expired. Force reset.
      if (tokenStatus.expired()) {
        this.$auth.reset()
      }
    }

    if (this.options.clientId) {
      this._syncClientId()
    }

    // Initialize request interceptor
    this.requestHandler.initializeRequestInterceptor()

    // Fetch user once
    return this.$auth.fetchUserOnce()
  }

  check () {
    if (this.options.token.required && !this.$auth.token.get()) {
      return false
    }

    return true
  }

  async login (endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    // Update Token
    if (this.options.token.required) {
      const token = getResponseProp(response, this.options.token.property)
      this.$auth.token.set(token)
    }

    // Update clientId
    if (this.options.clientId) {
      this._setClientId(getResponseProp(response, this.options.clientId.property))
    }

    // Fetch user
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }

    return response
  }

  async setUserToken (tokenValue) {
    this.$auth.token.set(getProp(tokenValue, this.options.token.property))

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

  async logout (endpoint: HTTPRequest = {}) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      // Only add client id to payload if enabled
      if (this.options.clientId) {
        if (!endpoint.data) {
          endpoint.data = {}
        }
        endpoint.data[this.options.clientId.data] = this._getClientId()
      }

      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => { })
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset () {
    if (this.options.clientId) {
      this._setClientId(false)
    }

    this.$auth.setUser(false)
    this.$auth.token.reset()

    return Promise.resolve()
  }
}
