import Cookies from 'js-cookie'
import { parse as parseCookie } from 'cookie'
import getProp from 'dotprop'
import Vue from 'vue'
import { routeOption, isRelativeURL, isUnset, isSameURL } from './utilities'

export default class Auth {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    // Strategies
    this.strategies = {}

    // Error listeners
    this._errorListeners = []

    // Private state is suitable to keep information not being exposed to Vuex store
    // This helps prevent stealing token from SSR resnponse HTML
    Vue.set(this, '_state', {})
  }

  init () {
    // Register vuex store
    this._registerVuexStore()

    // Reset on error
    if (this.options.resetOnError) {
      this._resetOnError()
    }

    // Watch for loggedIn changes only in client side
    if (process.browser) {
      this._autoRedirect()
    }

    // Sync token
    this.syncToken()

    // Set defaultStrategy
    return this.setStrategy()
  }

  // ---------------------------------------------------------------
  // Private functions
  // ---------------------------------------------------------------

  _registerVuexStore () {
    const authModule = {
      namespaced: true,
      state: () => ({
        strategy: null,
        user: null,
        loggedIn: false
      }),
      mutations: {
        SET (state, payload) {
          Vue.set(state, payload.key, payload.value)
        }
      }
    }

    this.ctx.store.registerModule(this.options.namespace, authModule, {
      preserveState: Boolean(this.ctx.store.state[this.options.namespace])
    })
  }

  _resetOnError () {
    this.onError(() => {
      this.reset()
    })
  }

  _autoRedirect () {
    this.watchState('loggedIn', loggedIn => {
      if (!routeOption(this.ctx.route, 'auth', false)) {
        this.redirect(loggedIn ? 'home' : 'logout')
      }
    })
  }

  // ---------------------------------------------------------------
  // State related functions
  // ---------------------------------------------------------------

  // ...Universal

  setUniversal (key, value) {
    // Local state
    this.setState(key, value)

    // Cookies
    this.setCookie(key, value)

    // Local Storage
    this.setLocalStorage(key, value)
  }

  getUniversal (key) {
    // Local state
    let value = this.getState(key)

    // Cookies
    if (isUnset(value)) {
      value = this.getCookie(key)
    }

    // Local Storage
    if (isUnset(value)) {
      value = this.getLocalStorage(key)
    }

    return value
  }

  syncUniversal (key) {
    const value = this.getUniversal(key)

    if (!isUnset(value)) {
      this.setUniversal(key, value)
    }

    return value
  }

  // ...Vuex

  get state () {
    return this.ctx.store.state[this.options.namespace]
  }

  setState (key, value) {
    if (key[0] === '_') {
      Vue.set(this._state, key, value)
    } else {
      this.ctx.store.commit(this.options.namespace + '/SET', { key, value })
    }
  }

  getState (key) {
    if (key[0] === '_') {
      return this._state[key]
    } else {
      return this.state[key]
    }
  }

  watchState (key, fn) {
    return this.ctx.store.watch(
      state => getProp(state[this.options.namespace], key),
      fn
    )
  }

  // ...Local Storage

  setLocalStorage (key, value) {
    if (typeof localStorage !== 'undefined') {
      if (isUnset(value)) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, value)
      }
    }
  }

  getLocalStorage (key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  }

  // ...Cookies

  setCookie (key, value, options = {}) {
    if (process.server || !this.options.cookie) {
      return
    }

    const _options = Object.assign({}, this.options.cookie.options, options)

    if (isUnset(value)) {
      Cookies.remove(key, _options)
    } else {
      Cookies.set(key, value, _options)
    }
  }

  getCookie (key) {
    if (!this.options.cookie) {
      return
    }

    const cookieStr = process.browser
      ? document.cookie
      : this.ctx.req.headers.cookie

    const cookies = parseCookie(cookieStr || '') || {}

    return cookies[key]
  }

  // ---------------------------------------------------------------
  // Strategy related functions
  // ---------------------------------------------------------------

  get strategy () {
    return this.strategies[this.state.strategy]
  }

  registerStrategy (name, strategy) {
    this.strategies[name] = strategy
  }

  setStrategy (name) {
    if (name === undefined) {
      name = this.options.defaultStrategy
    }

    const oldName = this.getState('strategy')

    if (oldName === name) {
      return Promise.resolve()
    }

    // Update state
    this.setState('strategy', name)

    // Call mounted hook on active strategy
    return this._mounted()
  }

  // ---------------------------------------------------------------
  // Scheme interface wrappers
  // ---------------------------------------------------------------

  _mounted () {
    return this.strategy.mounted(this, ...arguments)
  }

  login () {
    return this.strategy.login(this, ...arguments)
  }

  fetchUser () {
    return this.strategy.fetchUser(this, ...arguments)
  }

  logout () {
    return this.strategy.logout(this, ...arguments)
  }

  // ---------------------------------------------------------------
  // Token helpers
  // ---------------------------------------------------------------

  get token () {
    return this._state._token
  }

  setToken (token) {
    if (!this.options.token) {
      return
    }

    // Keep in private state
    this.setState('_token', token)

    // Set Authorization token for all axios requests
    this.ctx.app.$axios.setToken(token, this.options.token.type)

    // Save it in cookies
    this.setCookie(this.options.cookie.name, token)

    // Save it in localStorage
    this.setLocalStorage(this.options.token.name, token)
  }

  syncToken () {
    if (!this.options.token) {
      return
    }

    let token = this.getState('_token')

    if (isUnset(token)) {
      token = this.getCookie(this.options.cookie.name)
    }

    if (isUnset(token)) {
      token = this.getLocalStorage(this.options.token.name)
    }

    this.setToken(token)
  }

  // ---------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------

  request (endpoint, defaults) {
    const _endpoint = Object.assign({}, defaults, endpoint)

    return this.ctx.app.$axios
      .request(_endpoint)
      .then(response => {
        if (_endpoint.propertyName) {
          return getProp(response.data, _endpoint.propertyName)
        } else {
          return response.data
        }
      })
      .catch(error => {
        // Call all error handlers
        this.callOnError(error, _endpoint)

        // Throw error
        return Promise.reject(error)
      })
  }

  onError (listener) {
    this._errorListeners.push(listener)
  }

  callOnError () {
    for (let fn of this._errorListeners) {
      fn.apply(this, arguments)
    }
  }

  reset () {
    this.setState('loggedIn', false)
    this.setState('user', null)
    this.setToken(null)
  }

  redirect (name) {
    if (!this.options.redirect) {
      return
    }

    let to = this.options.redirect[name]
    const from = this.ctx.route.path

    if (!to) {
      return
    }

    // Apply rewrites
    if (this.options.rewriteRedirects) {
      if (name === 'login') {
        to = to + '?redirect=' + encodeURIComponent(from)
      }

      if (name === 'home' && this.ctx.route.query.redirect) {
        // Decode
        const redirect = decodeURIComponent(this.ctx.route.query.redirect)
        // Validate
        if (isRelativeURL(redirect)) {
          to = redirect
        }
      }
    }

    // Prevent infinity redirects
    if (isSameURL(to, from)) {
      return
    }

    this.ctx.redirect(to)
  }

  hasScope (scope) {
    const userScopes = this.state.user && getProp(this.state.user, this.options.scopeKey)

    if (!userScopes) {
      return undefined
    }

    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }

    return Boolean(getProp(userScopes, scope))
  }
}
