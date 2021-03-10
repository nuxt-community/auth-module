import type { Context } from '@nuxt/types'
import type {
  HTTPRequest,
  HTTPResponse,
  Route,
  Scheme,
  TokenableScheme,
  RefreshableScheme,
  SchemeCheck
} from '../types'
import type { ModuleOptions } from '../options'
import {
  routeOption,
  isRelativeURL,
  isSet,
  isSameURL,
  getProp,
  normalizePath
} from '../utils'
import { Storage } from './storage'

export type ErrorListener = (...args: unknown[]) => void
export type RedirectListener = (to: string, from: string) => string

export class Auth {
  public ctx: Context
  public options: ModuleOptions
  public strategies: Record<string, Scheme> = {}
  public error: Error
  public $storage: Storage
  public $state
  private _errorListeners: ErrorListener[] = []
  private _redirectListeners: RedirectListener[] = []
  private _stateWarnShown: boolean
  private _getStateWarnShown: boolean

  constructor(ctx: Context, options: ModuleOptions) {
    this.ctx = ctx
    this.options = options

    // Storage & State
    const initialState = { user: null, loggedIn: false }
    const storage = new Storage(ctx, { ...options, ...{ initialState } })
    this.$storage = storage
    this.$state = storage.state
  }

  // Backward compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get state(): any {
    if (!this._stateWarnShown) {
      this._stateWarnShown = true
      // eslint-disable-next-line no-console
      console.warn(
        '[AUTH] $auth.state is deprecated. Please use $auth.$state or top level props like $auth.loggedIn'
      )
    }

    return this.$state
  }

  get strategy(): Scheme {
    return this.getStrategy()
  }

  getStrategy(throwException = true): Scheme {
    if (throwException) {
      if (!this.$state.strategy) {
        throw new Error('No strategy is set!')
      }
      if (!this.strategies[this.$state.strategy]) {
        throw new Error('Strategy not supported: ' + this.$state.strategy)
      }
    }
    return this.strategies[this.$state.strategy]
  }

  get user(): Record<string, unknown> | null {
    return this.$state.user
  }

  // ---------------------------------------------------------------
  // Strategy and Scheme
  // ---------------------------------------------------------------

  get loggedIn(): boolean {
    return this.$state.loggedIn
  }

  get busy(): boolean {
    return this.$storage.getState('busy') as boolean
  }

  async init(): Promise<void> {
    // Reset on error
    if (this.options.resetOnError) {
      this.onError((...args) => {
        if (
          typeof this.options.resetOnError !== 'function' ||
          this.options.resetOnError(...args)
        ) {
          this.reset()
        }
      })
    }

    // Restore strategy
    this.$storage.syncUniversal('strategy', this.options.defaultStrategy)

    // Set default strategy if current one is invalid
    if (!this.getStrategy(false)) {
      this.$storage.setUniversal('strategy', this.options.defaultStrategy)

      // Give up if still invalid
      if (!this.getStrategy(false)) {
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
          if (
            // TODO: Why Router is incompatible?
            !routeOption((this.ctx.route as unknown) as Route, 'auth', false)
          ) {
            this.redirect(loggedIn ? 'home' : 'logout')
          }
        })
      }
    }
  }

  getState(key: string): unknown {
    if (!this._getStateWarnShown) {
      this._getStateWarnShown = true
      // eslint-disable-next-line no-console
      console.warn(
        '[AUTH] $auth.getState is deprecated. Please use $auth.$storage.getState() or top level props like $auth.loggedIn'
      )
    }

    return this.$storage.getState(key)
  }

  registerStrategy(name: string, strategy: Scheme): void {
    this.strategies[name] = strategy
  }

  setStrategy(name: string): Promise<HTTPResponse | void> {
    if (name === this.$storage.getUniversal('strategy')) {
      return Promise.resolve()
    }

    if (!this.strategies[name]) {
      throw new Error(`Strategy ${name} is not defined!`)
    }

    // Reset current strategy
    this.reset()

    // Set new strategy
    this.$storage.setUniversal('strategy', name)

    // Call mounted hook on active strategy
    return this.mounted()
  }

  mounted(...args: unknown[]): Promise<HTTPResponse | void> {
    if (!this.getStrategy().mounted) {
      return this.fetchUserOnce()
    }

    return Promise.resolve(this.getStrategy().mounted(...args)).catch(
      (error) => {
        this.callOnError(error, { method: 'mounted' })
        return Promise.reject(error)
      }
    )
  }

  loginWith(name: string, ...args: unknown[]): Promise<HTTPResponse | void> {
    return this.setStrategy(name).then(() => this.login(...args))
  }

  login(...args: unknown[]): Promise<HTTPResponse | void> {
    if (!this.getStrategy().login) {
      return Promise.resolve()
    }

    return this.wrapLogin(this.getStrategy().login(...args)).catch((error) => {
      this.callOnError(error, { method: 'login' })
      return Promise.reject(error)
    })
  }

  fetchUser(...args: unknown[]): Promise<HTTPResponse | void> {
    if (!this.getStrategy().fetchUser) {
      return Promise.resolve()
    }

    return Promise.resolve(this.getStrategy().fetchUser(...args)).catch(
      (error) => {
        this.callOnError(error, { method: 'fetchUser' })
        return Promise.reject(error)
      }
    )
  }

  logout(...args: unknown[]): Promise<void> {
    if (!this.getStrategy().logout) {
      this.reset()
      return Promise.resolve()
    }

    return Promise.resolve(this.getStrategy().logout(...args)).catch(
      (error) => {
        this.callOnError(error, { method: 'logout' })
        return Promise.reject(error)
      }
    )
  }

  // ---------------------------------------------------------------
  // User helpers
  // ---------------------------------------------------------------

  setUserToken(
    token: string | boolean,
    refreshToken?: string | boolean
  ): Promise<HTTPResponse | void> {
    if (!this.getStrategy().setUserToken) {
      ;(this.getStrategy() as TokenableScheme).token.set(token)
      return Promise.resolve()
    }

    return Promise.resolve(
      this.getStrategy().setUserToken(token, refreshToken)
    ).catch((error) => {
      this.callOnError(error, { method: 'setUserToken' })
      return Promise.reject(error)
    })
  }

  reset(...args: unknown[]): void {
    if (!this.getStrategy().reset) {
      this.setUser(false)
      // TODO: Check if is Tokenable Scheme
      ;(this.getStrategy() as TokenableScheme).token.reset()
      // TODO: Check if is Refreshable Scheme
      ;(this.getStrategy() as RefreshableScheme).refreshToken.reset()
    }

    return this.getStrategy().reset(
      ...(args as [options?: { resetInterceptor: boolean }])
    )
  }

  refreshTokens(): Promise<HTTPResponse | void> {
    if (!(this.getStrategy() as RefreshableScheme).refreshController) {
      return Promise.resolve()
    }

    return Promise.resolve(
      (this.getStrategy() as RefreshableScheme).refreshController.handleRefresh()
    ).catch((error) => {
      this.callOnError(error, { method: 'refreshTokens' })
      return Promise.reject(error)
    })
  }

  check(...args: unknown[]): SchemeCheck {
    if (!this.getStrategy().check) {
      return { valid: true }
    }

    return this.getStrategy().check(...(args as [checkStatus: boolean]))
  }

  fetchUserOnce(...args: unknown[]): Promise<HTTPResponse | void> {
    if (!this.$state.user) {
      return this.fetchUser(...args)
    }
    return Promise.resolve()
  }

  // ---------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------

  setUser(user: unknown): void {
    this.$storage.setState('user', user)

    let check = { valid: Boolean(user) }

    // If user is defined, perform scheme checks.
    if (check.valid) {
      check = this.check()
    }

    // Update `loggedIn` state
    this.$storage.setState('loggedIn', check.valid)
  }

  request(
    endpoint: HTTPRequest,
    defaults: HTTPRequest = {}
  ): Promise<HTTPResponse> {
    const _endpoint =
      typeof defaults === 'object'
        ? Object.assign({}, defaults, endpoint)
        : endpoint

    if (!this.ctx.app.$axios) {
      // eslint-disable-next-line no-console
      console.error('[AUTH] add the @nuxtjs/axios module to nuxt.config file')
      return
    }

    return this.ctx.app.$axios.request(_endpoint).catch((error) => {
      // Call all error handlers
      this.callOnError(error, { method: 'request' })

      // Throw error
      return Promise.reject(error)
    })
  }

  requestWith(
    strategy: string,
    endpoint: HTTPRequest,
    defaults?: HTTPRequest
  ): Promise<HTTPResponse> {
    // TODO: Check if is Tokenable Scheme
    const token = (this.getStrategy() as TokenableScheme).token.get()

    const _endpoint = Object.assign({}, defaults, endpoint)

    // TODO: Use `this.getStrategy()` instead of `this.strategies[strategy]`
    const tokenName =
      (this.strategies[strategy] as TokenableScheme).options.token.name ||
      'Authorization'
    if (!_endpoint.headers) {
      _endpoint.headers = {}
    }
    if (
      !_endpoint.headers[tokenName] &&
      isSet(token) &&
      token &&
      typeof token === 'string'
    ) {
      _endpoint.headers[tokenName] = token
    }

    return this.request(_endpoint)
  }

  wrapLogin(
    promise: Promise<HTTPResponse | void>
  ): Promise<HTTPResponse | void> {
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

  onError(listener: ErrorListener): void {
    this._errorListeners.push(listener)
  }

  callOnError(error: Error, payload = {}): void {
    this.error = error

    for (const fn of this._errorListeners) {
      fn(error, payload)
    }
  }

  redirect(name: string, noRouter = false): void {
    if (!this.options.redirect) {
      return
    }

    const from = this.options.fullPathRedirect
      ? this.ctx.route.fullPath
      : this.ctx.route.path

    let to = this.options.redirect[name]
    if (!to) {
      return
    }

    // Apply rewrites
    if (this.options.rewriteRedirects) {
      if (
        name === 'login' &&
        isRelativeURL(from) &&
        !isSameURL(this.ctx, to, from)
      ) {
        this.$storage.setUniversal('redirect', from)
      }

      if (name === 'home') {
        const redirect = this.$storage.getUniversal('redirect') as string
        this.$storage.setUniversal('redirect', null)

        if (isRelativeURL(redirect)) {
          to = redirect
        }
      }
    }

    // Call onRedirect hook
    to = this.callOnRedirect(to, from) || to

    // Prevent infinity redirects
    if (isSameURL(this.ctx, to, from)) {
      return
    }

    if (process.client) {
      if (noRouter) {
        if (isRelativeURL(to) && !to.includes(this.ctx.base)) {
          to = normalizePath('/' + this.ctx.base + '/' + to) // Don't pass in context to preserve base url
        }
        window.location.replace(to)
      } else {
        this.ctx.redirect(to, this.ctx.query)
      }
    } else {
      this.ctx.redirect(to, this.ctx.query)
    }
  }

  onRedirect(listener: RedirectListener): void {
    this._redirectListeners.push(listener)
  }

  callOnRedirect(to: string, from: string): string {
    for (const fn of this._redirectListeners) {
      to = fn(to, from) || to
    }
    return to
  }

  hasScope(scope: string): boolean {
    const userScopes =
      this.$state.user && getProp(this.$state.user, this.options.scopeKey)

    if (!userScopes) {
      return false
    }

    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }

    return Boolean(getProp(userScopes, scope))
  }
}
