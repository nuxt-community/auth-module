import Cookies from 'js-cookie'
import { parse as parseCookie } from 'cookie'
import getProp from 'dotprop'
import Vue from 'vue'
import { routeOption, isRelativeURL, isUnset, isSet, isSameURL } from './utilities'

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

    // Watch for loggedIn changes only in client side
    if (process.browser) {
      this._autoRedirect()
    }

    // Restore strategy
    this.syncUniversal('strategy', this.options.defaultStrategy)

    // Call mounted for active strategy on initial load
    return this.mounted()
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

  setUniversal (key, value, isJson) {
    // Local state
    this.setState(key, value)

    // Cookies
    this.setCookie(key, value)

    // Local Storage
    this.setLocalStorage(key, value, isJson)
  }

  getUniversal (key, isJson) {
    // Local state
    let value = this.getState(key)

    // Cookies
    if (isUnset(value)) {
      value = this.getCookie(key, isJson)
    }

    // Local Storage
    if (isUnset(value)) {
      value = this.getLocalStorage(key, isJson)
    }

    return value
  }

  syncUniversal (key, defaultValue, isJson) {
    let value = this.getUniversal(key, isJson)

    if (isUnset(value) && isSet(defaultValue)) {
      value = defaultValue
    }

    if (isSet(value)) {
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

  setLocalStorage (key, value, isJson) {
    if (typeof localStorage !== 'undefined') {
      if (isUnset(value)) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, isJson ? JSON.stringify(value) : value)
      }
    }
  }

  getLocalStorage (key, isJson) {
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem(key)
      return isJson ? JSON.parse(value) : value
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

  getCookie (key, isJson) {
    if (!this.options.cookie) {
      return
    }

    const cookieStr = process.browser
      ? document.cookie
      : this.ctx.req.headers.cookie

    const cookies = parseCookie(cookieStr || '') || {}
    const value = cookies[key]

    return isJson ? JSON.parse(value) : value
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
    if (name === this.getUniversal('strategy')) {
      return Promise.resolve()
    }

    // Call to reset
    this.reset()

    // Set strategy
    this.setUniversal('strategy', name)

    // Call mounted hook on active strategy
    return this.mounted()
  }

  // ---------------------------------------------------------------
  // Scheme interface wrappers and default handlers
  // ---------------------------------------------------------------

  mounted () {
    if (this.strategy.mounted) {
      return Promise.resolve(this.strategy.mounted(...arguments)).then(() => this.fetchUserOnce())
    }

    return this.fetchUserOnce()
  }

  login () {
    if (this.strategy.login) {
      return Promise.resolve(this.strategy.login(...arguments))
    }

    return Promise.resolve()
  }

  fetchUser () {
    if (this.strategy.fetchUser) {
      return Promise.resolve(this.strategy.fetchUser(...arguments))
    }

    return Promise.resolve()
  }

  logout () {
    if (this.strategy.logout) {
      return Promise.resolve(this.strategy.logout(...arguments)).then(() => this.reset())
    }

    this.reset()

    return Promise.resolve()
  }

  reset () {
    if (this.strategy.reset) {
      this.strategy.reset(...arguments)
    }

    this.setState('loggedIn', false)
    this.setState('user', null)
    this.setToken(null)
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
  // User helpers
  // ---------------------------------------------------------------

  fetchUserOnce () {
    if (!this.state.user) {
      return this.fetchUser(...arguments)
    }
    return Promise.resolve()
  }

  setUser (user) {
    this.setState('user', user)
    this.setState('loggedIn', true)
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
