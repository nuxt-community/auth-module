import { routeOption, isRelativeURL, isSet, isSameURL, getProp } from '../utils'
import RefreshToken from '../inc/refresh-token'
import Token from '../inc/token'
import type { AuthOptions, HTTPRequest, HTTPResponse } from '../'
import Storage from './storage'

export default class Auth {
  public ctx: any
  public options: AuthOptions
  public strategies = {}
  public error: Error

  public token: Token
  public refreshToken: RefreshToken

  private _errorListeners = []
  private _redirectListeners = []
  private _stateWarnShown: boolean
  private _getStateWarnShown: boolean

  public $storage: Storage
  public $state

  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    // Storage & State
    options.initialState = { user: null, loggedIn: false }
    const storage = new Storage(ctx, options)
    this.$storage = storage
    this.$state = storage.state

    // Token & Refresh Token
    this.token = new Token(this)
    this.refreshToken = new RefreshToken(this)
  }

  async init () {
    // Reset on error
    if (this.options.resetOnError) {
      this.onError((...args) => {
        if (typeof (this.options.resetOnError) !== 'function' || this.options.resetOnError(...args)) {
          this.reset()
        }
      })
    }

    // Restore strategy
    this.$storage.syncUniversal('strategy', this.options.defaultStrategy)

    // Set default strategy if current one is invalid
    if (!this.strategy) {
      this.$storage.setUniversal('strategy', this.options.defaultStrategy)

      // Give up if still invalid
      if (!this.strategy) {
        return Promise.resolve()
      }
    }

    try {
      // Call mounted for active strategy on initial load
      await this.mounted()
    } catch (error) {
      this.callOnError(error)
    } finally {
      // Watch for loggedIn changes only in client side
      if (process.client && this.options.watchLoggedIn) {
        this.$storage.watchState('loggedIn', (loggedIn) => {
          if (!routeOption(this.ctx.route, 'auth', false)) {
            this.redirect(loggedIn ? 'home' : 'logout')
          }
        })
      }
    }
  }

  // Backward compatibility
  get state () {
    if (!this._stateWarnShown) {
      this._stateWarnShown = true
      // eslint-disable-next-line no-console
      console.warn('[AUTH] $auth.state is deprecated. Please use $auth.$state or top level props like $auth.loggedIn')
    }

    return this.$state
  }

  getState (key) {
    if (!this._getStateWarnShown) {
      this._getStateWarnShown = true
      // eslint-disable-next-line no-console
      console.warn('[AUTH] $auth.getState is deprecated. Please use $auth.$storage.getState() or top level props like $auth.loggedIn')
    }

    return this.$storage.getState(key)
  }

  // ---------------------------------------------------------------
  // Strategy and Scheme
  // ---------------------------------------------------------------

  get strategy () {
    return this.strategies[this.$state.strategy]
  }

  registerStrategy (name, strategy) {
    this.strategies[name] = strategy
  }

  setStrategy (name) {
    if (name === this.$storage.getUniversal('strategy')) {
      return Promise.resolve()
    }

    if (!this.strategies[name]) {
      throw new Error(`Strategy ${name} is not defined!`)
    }

    // Set strategy
    this.$storage.setUniversal('strategy', name)

    // Call mounted hook on active strategy
    return this.mounted()
  }

  mounted () {
    if (!this.strategy.mounted) {
      return this.fetchUserOnce()
    }

    return Promise.resolve(this.strategy.mounted(...arguments)).catch((error) => {
      this.callOnError(error, { method: 'mounted' })
      return Promise.reject(error)
    })
  }

  loginWith (name, ...args) {
    return this.setStrategy(name).then(() => this.login(...args))
  }

  login (...args) {
    if (!this.strategy.login) {
      return Promise.resolve()
    }

    return this.wrapLogin(this.strategy.login(...args))
      .catch((error) => {
        this.callOnError(error, { method: 'login' })
        return Promise.reject(error)
      })
  }

  fetchUser (...args) {
    if (!this.strategy.fetchUser) {
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.fetchUser(...args)).catch((error) => {
      this.callOnError(error, { method: 'fetchUser' })
      return Promise.reject(error)
    })
  }

  logout () {
    if (!this.strategy.logout) {
      this.reset()
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.logout(...arguments)).catch((error) => {
      this.callOnError(error, { method: 'logout' })
      return Promise.reject(error)
    })
  }

  setUserToken (token) {
    if (!this.strategy.setUserToken) {
      this.token.set(token)
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.setUserToken(token)).catch((error) => {
      this.callOnError(error, { method: 'setUserToken' })
      return Promise.reject(error)
    })
  }

  reset () {
    if (!this.strategy.reset) {
      this.setUser(false)
      this.token.reset()
      this.refreshToken.reset()
    }

    return this.strategy.reset(...arguments)
  }

  refreshTokens () {
    if (!this.strategy.refreshController) {
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.refreshController.handleRefresh()).catch((error) => {
      this.callOnError(error, { method: 'refreshTokens' })
      return Promise.reject(error)
    })
  }

  // ---------------------------------------------------------------
  // User helpers
  // ---------------------------------------------------------------

  get user () {
    return this.$state.user
  }

  get loggedIn () {
    return this.$state.loggedIn
  }

  check () {
    let loggedIn = Boolean(this.$state.user)

    if (loggedIn && typeof this.strategy.check === 'function') {
      loggedIn = this.strategy.check()
    }

    this.$storage.setState('loggedIn', loggedIn)
    return loggedIn
  }

  fetchUserOnce (...args) {
    if (!this.$state.user) {
      return this.fetchUser(...args)
    }
    return Promise.resolve()
  }

  setUser (user) {
    this.$storage.setState('user', user)
    this.check()
  }

  // ---------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------

  get busy () {
    return this.$storage.getState('busy')
  }

  request (endpoint: HTTPRequest, defaults = {}): Promise<HTTPResponse> {
    const _endpoint =
      typeof defaults === 'object'
        ? Object.assign({}, defaults, endpoint)
        : endpoint

    if (!this.ctx.app.$axios) {
      // eslint-disable-next-line no-console
      console.error('[AUTH] add the @nuxtjs/axios module to nuxt.config file')
      return
    }

    return this.ctx.app.$axios
      .request(_endpoint)
      .catch((error) => {
        // Call all error handlers
        this.callOnError(error, { method: 'request' })

        // Throw error
        return Promise.reject(error)
      })
  }

  requestWith (strategy: string, endpoint: HTTPRequest, defaults?: HTTPRequest): Promise<HTTPResponse> {
    const token = this.token.get()

    const _endpoint = Object.assign({}, defaults, endpoint)

    const tokenName = this.strategies[strategy].options.tokenName || 'Authorization'
    if (!_endpoint.headers) {
      _endpoint.headers = {}
    }
    if (!_endpoint.headers[tokenName] && isSet(token) && token) {
      _endpoint.headers[tokenName] = token
    }

    return this.request(_endpoint)
  }

  wrapLogin (promise) {
    this.$storage.setState('busy', true)
    this.error = null

    return Promise.resolve(promise)
      .then((response) => {
        this.$storage.setState('busy', false)
        return response
      })
      .catch((error) => {
        this.$storage.setState('busy', false)
        return Promise.reject(error)
      })
  }

  onError (listener) {
    this._errorListeners.push(listener)
  }

  callOnError (error, payload = {}) {
    this.error = error

    for (const fn of this._errorListeners) {
      fn(error, payload)
    }
  }

  redirect (name, noRouter = false) {
    if (!this.options.redirect) {
      return
    }

    const from = this.options.fullPathRedirect ? this.ctx.route.fullPath : this.ctx.route.path

    let to = this.options.redirect[name]
    if (!to) {
      return
    }

    // Apply rewrites
    if (this.options.rewriteRedirects) {
      if (name === 'login' && isRelativeURL(from) && !isSameURL(to, from)) {
        this.$storage.setUniversal('redirect', from)
      }

      if (name === 'home') {
        const redirect = this.$storage.getUniversal('redirect')
        this.$storage.setUniversal('redirect', null)

        if (isRelativeURL(redirect)) {
          to = redirect
        }
      }
    }

    // Call onRedirect hook
    to = this.callOnRedirect(to, from) || to

    // Prevent infinity redirects
    if (isSameURL(to, from)) {
      return
    }

    if (process.client) {
      if (noRouter||this.options.noRouter) {
        window.location.replace(to)
      } else {
        this.ctx.redirect(to, this.ctx.query)
      }
    } else {
      this.ctx.redirect(to, this.ctx.query)
    }
  }

  onRedirect (listener) {
    this._redirectListeners.push(listener)
  }

  callOnRedirect (to, from) {
    for (const fn of this._redirectListeners) {
      to = fn(to, from) || to
    }
    return to
  }

  hasScope (scope) {
    const userScopes = this.$state.user && getProp(this.$state.user, this.options.scopeKey)

    if (!userScopes) {
      return false
    }

    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }

    return Boolean(getProp(userScopes, scope))
  }
}
