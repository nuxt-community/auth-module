import Vue from 'vue'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import { isUnset, isSet, decodeValue, encodeValue, getProp } from './utilities'

export default class Storage {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    this._initState()
  }

  // ------------------------------------
  // Universal
  // ------------------------------------

  setUniversal (key, value) {
    // Unset null, undefined
    if (isUnset(value)) {
      return this.removeUniversal(key)
    }

    // Local state
    this.setState(key, value)

    // Cookies
    this.setCookie(key, value)

    // Local Storage
    this.setLocalStorage(key, value)

    return value
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

  syncUniversal (key, defaultValue) {
    let value = this.getUniversal(key)

    if (isUnset(value) && isSet(defaultValue)) {
      value = defaultValue
    }

    if (isSet(value)) {
      this.setUniversal(key, value)
    }

    return value
  }

  removeUniversal (key) {
    this.removeState(key)
    this.removeLocalStorage(key)
    this.removeCookie(key)
  }

  // ------------------------------------
  // Local state (reactive)
  // ------------------------------------

  _initState () {
    // Private state is suitable to keep information not being exposed to Vuex store
    // This helps prevent stealing token from SSR response HTML
    Vue.set(this, '_state', {})

    // Use vuex for local state's if possible
    this._useVuex = this.options.vuex && this.ctx.store

    if (this._useVuex) {
      const storeModule = {
        namespaced: true,
        state: () => this.options.initialState,
        mutations: {
          SET (state, payload) {
            Vue.set(state, payload.key, payload.value)
          }
        }
      }

      this.ctx.store.registerModule(this.options.vuex.namespace, storeModule, {
        preserveState: Boolean(this.ctx.store.state[this.options.vuex.namespace])
      })

      this.state = this.ctx.store.state[this.options.vuex.namespace]
    } else {
      Vue.set(this, 'state', {})
    }
  }

  setState (key, value) {
    if (key[0] === '_') {
      Vue.set(this._state, key, value)
    } else {
      if (this._useVuex) {
        this.ctx.store.commit(this.options.vuex.namespace + '/SET', {
          key,
          value
        })
      } else {
        Vue.set(this.state, key, value)
      }
    }

    return value
  }

  getState (key) {
    if (key[0] !== '_') {
      return this.state[key]
    } else {
      return this._state[key]
    }
  }

  watchState (key, fn) {
    if (this._useVuex) {
      return this.ctx.store.watch(
        state => getProp(state[this.options.vuex.namespace], key),
        fn
      )
    }
  }

  removeState (key) {
    this.setState(key, undefined)
  }

  // ------------------------------------
  // Local storage
  // ------------------------------------

  setLocalStorage (key, value) {
    // Unset null, undefined
    if (isUnset(value)) {
      return this.removeLocalStorage(key)
    }

    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    try {
      localStorage.setItem(_key, encodeValue(value))
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        throw e
      }
    }

    return value
  }

  getLocalStorage (key) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    const value = localStorage.getItem(_key)

    return decodeValue(value)
  }

  removeLocalStorage (key) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key
    localStorage.removeItem(_key)
  }

  // ------------------------------------
  // Cookies
  // ------------------------------------
  getCookies () {
    const cookieStr = process.client
      ? document.cookie
      : this.ctx.req.headers.cookie

    return parseCookie(cookieStr || '') || {}
  }

  setCookie (key, value, options = {}) {
    if (!this.options.cookie || (process.server && !this.ctx.res)) {
      return
    }

    const _key = this.options.cookie.prefix + key
    const _options = Object.assign({}, this.options.cookie.options, options)
    const _value = encodeValue(value)

    // Unset null, undefined
    if (isUnset(value)) {
      _options.maxAge = -1
    }

    // Accept expires as a number for js-cookie compatiblity
    if (typeof _options.expires === 'number') {
      _options.expires = new Date(new Date() * 1 + _options.expires * 864e+5)
    }

    const serializedCookie = serializeCookie(_key, _value, _options)

    if (process.client) {
      // Set in browser
      document.cookie = serializedCookie
    } else if (process.server && this.ctx.res) {
      // Send Set-Cookie header from server side
      const prevCookies = this.ctx.res.getHeader('Set-Cookie')
      this.ctx.res.setHeader('Set-Cookie', [].concat(prevCookies, serializedCookie).filter(v => v))
    }

    return value
  }

  getCookie (key) {
    if (!this.options.cookie || (process.server && !this.ctx.req)) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const cookies = this.getCookies()

    const value = cookies[_key] ? decodeURIComponent(cookies[_key]) : undefined

    return decodeValue(value)
  }

  removeCookie (key, options) {
    this.setCookie(key, undefined, options)
  }
}
