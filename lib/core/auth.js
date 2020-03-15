import Storage from './storage'
import { routeOption, isRelativeURL, isSet, isSameURL, getProp } from './utilities'

export default class Auth {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    // Strategies
    this.strategies = {}

    // Error listeners
    this._errorListeners = []

    // Redirect listeners
    this._redirectListeners = []

    // Storage & State
    options.initialState = { user: null, loggedIn: false }
    const storage = new Storage(ctx, options)

    this.$storage = storage
    this.$state = storage.state
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
        this.$storage.watchState('loggedIn', loggedIn => {
          if (!routeOption(this.ctx.route, 'auth', false)) {
            this.redirect(loggedIn ? 'home' : 'logout')
          }
        })
      }
    }
  }

  // Backward compatibility
  get state () {
    if (!this._state_warn_shown) {
      this._state_warn_shown = true
      // eslint-disable-next-line no-console
      console.warn('[AUTH] $auth.state is deprecated. Please use $auth.$state or top level props like $auth.loggedIn')
    }

    return this.$state
  }

  getState (key) {
    if (!this._get_state_warn_shown) {
      this._get_state_warn_shown = true
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

    // Set strategy
    this.$storage.setUniversal('strategy', name)

    // Call mounted hook on active strategy
    return this.mounted()
  }

  mounted () {
    if (!this.strategy.mounted) {
      return this.fetchUserOnce()
    }

    return Promise.resolve(this.strategy.mounted(...arguments)).catch(error => {
      this.callOnError(error, { method: 'mounted' })
      return Promise.reject(error)
    })
  }

  loginWith (name, ...args) {
    return this.setStrategy(name).then(() => this.login(...args))
  }

  login () {
    if (!this.strategy.login) {
      return Promise.resolve()
    }

    return this.wrapLogin(this.strategy.login(...arguments))
      .catch(error => {
        this.callOnError(error, { method: 'login' })
        return Promise.reject(error)
      })
  }

  fetchUser () {
    if (!this.strategy.fetchUser) {
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.fetchUser(...arguments)).catch(error => {
      this.callOnError(error, { method: 'fetchUser' })
      return Promise.reject(error)
    })
  }

  logout () {
    if (!this.strategy.logout) {
      this.reset()
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.logout(...arguments)).catch(error => {
      this.callOnError(error, { method: 'logout' })
      return Promise.reject(error)
    })
  }

  setUserToken (token) {
    if (!this.strategy.setUserToken) {
      this.setToken(this.strategy.name, token)
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.setUserToken(token)).catch(error => {
      this.callOnError(error, { method: 'setUserToken' })
      return Promise.reject(error)
    })
  }

  reset () {
    if (!this.strategy.reset) {
      this.setUser(false)
      this.setToken(this.$state.strategy, false)
      this.setRefreshToken(this.$state.strategy, false)
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.reset(...arguments)).catch(error => {
      this.callOnError(error, { method: 'reset' })
      return Promise.reject(error)
    })
  }

  // ---------------------------------------------------------------
  // Token helpers
  // ---------------------------------------------------------------

  getToken (strategy) {
    const _key = this.options.token.prefix + strategy

    return this.$storage.getUniversal(_key)
  }

  setToken (strategy, token) {
    const _key = this.options.token.prefix + strategy

    return this.$storage.setUniversal(_key, token)
  }

  syncToken (strategy) {
    const _key = this.options.token.prefix + strategy

    return this.$storage.syncUniversal(_key)
  }

  // ---------------------------------------------------------------
  // Refresh token helpers
  // ---------------------------------------------------------------

  getRefreshToken (strategy) {
    const _key = this.options.refresh_token.prefix + strategy

    return this.$storage.getUniversal(_key)
  }

  setRefreshToken (strategy, refreshToken) {
    const _key = this.options.refresh_token.prefix + strategy

    return this.$storage.setUniversal(_key, refreshToken)
  }

  syncRefreshToken (strategy) {
    const _key = this.options.refresh_token.prefix + strategy

    return this.$storage.syncUniversal(_key)
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

  fetchUserOnce () {
    if (!this.$state.user) {
      return this.fetchUser(...arguments)
    }
    return Promise.resolve()
  }

  setUser (user) {
    this.$storage.setState('user', user)
    this.$storage.setState('loggedIn', Boolean(user))
  }

  // ---------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------

  get busy () {
    return this.$storage.getState('busy')
  }

  request (endpoint, defaults, withResponse) {
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
      .then(response => {
        const result = _endpoint.propertyName ? getProp(response.data, _endpoint.propertyName) : response.data

        if (withResponse) {
          return {
            response,
            result
          }
        } else {
          return result
        }
      })
      .catch(error => {
        // Call all error handlers
        this.callOnError(error, { method: 'request' })

        // Throw error
        return Promise.reject(error)
      })
  }

  requestWith (strategy, endpoint, defaults, withResponse) {
    const token = this.getToken(strategy)

    const _endpoint = Object.assign({}, defaults, endpoint)

    const tokenName = this.strategies[strategy].options.tokenName || 'Authorization'
    if (!_endpoint.headers) {
      _endpoint.headers = {}
    }
    if (!_endpoint.headers[tokenName] && isSet(token) && token) {
      _endpoint.headers[tokenName] = token
    }

    return this.request(_endpoint, false, withResponse)
  }

  wrapLogin (promise) {
    this.$storage.setState('busy', true)
    this.error = null

    return Promise.resolve(promise)
      .then(response => {
        this.$storage.setState('busy', false)
        return response
      })
      .catch(error => {
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
      if (noRouter) {
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
