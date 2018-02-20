import Cookies from 'js-cookie'
import { parse as parseCookie } from 'cookie'
import getProp from 'dotprop'
import Vue from 'vue'
import {
  routeOption,
  isRelativeURL,
  isUnset,
  isSet,
  isSameURL
} from './utilities'

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

    this.ctx.store.registerModule(this.options.vuex.namespace, authModule, {
      preserveState: Boolean(this.ctx.store.state[this.options.vuex.namespace])
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

    return value
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
    return this.ctx.store.state[this.options.vuex.namespace]
  }

  setState (key, value) {
    if (key[0] === '_') {
      Vue.set(this._state, key, value)
    } else {
      this.ctx.store.commit(this.options.vuex.namespace + '/SET', {
        key,
        value
      })
    }

    return value
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
      state => getProp(state[this.options.vuex.namespace], key),
      fn
    )
  }

  // ...Local Storage

  setLocalStorage (key, value, isJson) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    if (isUnset(value)) {
      localStorage.removeItem(_key)
    } else {
      localStorage.setItem(_key, isJson ? JSON.stringify(value) : value)
    }

    return value
  }

  getLocalStorage (key, isJson) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    const value = localStorage.getItem(_key)

    return isJson ? JSON.parse(value) : value
  }

  // ...Cookies

  setCookie (key, value, options = {}) {
    if (process.server || !this.options.cookie) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const _options = Object.assign({}, this.options.cookie.options, options)

    if (isUnset(value)) {
      Cookies.remove(_key, _options)
    } else {
      Cookies.set(_key, value, _options)
    }

    return value
  }

  getCookie (key, isJson) {
    if (!this.options.cookie) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const cookieStr = process.browser
      ? document.cookie
      : this.ctx.req.headers.cookie

    const cookies = parseCookie(cookieStr || '') || {}
    const value = cookies[_key]

    return isJson ? JSON.parse(value) : value
  }

  // ---------------------------------------------------------------
  // Strategy and Scheme
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

  mounted () {
    if (this.strategy.mounted) {
      return Promise.resolve(this.strategy.mounted(...arguments)).then(() =>
        this.fetchUserOnce()
      )
    }

    return this.fetchUserOnce()
  }

  loginWith (name, ...args) {
    return this.setStrategy(name).then(() => this.login(...args))
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
      return Promise.resolve(this.strategy.logout(...arguments)).then(() =>
        this.reset()
      )
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

  getToken (name) {
    const _key = '_' + (name || this.options.token.name)

    return this.getUniversal(_key)
  }

  setToken (token, name) {
    const _key = '_' + (name || this.options.token.name)

    return this.setUniversal(_key, token)
  }

  syncToken (name) {
    const _key = '_' + (name || this.options.token.name)

    return this.syncUniversal(_key)
  }

  // ---------------------------------------------------------------
  // User helpers
  // ---------------------------------------------------------------

  get user () {
    return this.state.user
  }

  get loggedIn () {
    return this.state.loggedIn
  }

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
    const userScopes =
      this.state.user && getProp(this.state.user, this.options.scopeKey)

    if (!userScopes) {
      return undefined
    }

    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }

    return Boolean(getProp(userScopes, scope))
  }
}
