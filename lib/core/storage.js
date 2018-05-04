import Vue from 'vue'
import Cookies from 'js-cookie'
import getProp from 'dotprop'
import { parse as parseCookie } from 'cookie'

import { isUnset, isSet } from './utilities'

export default class Storage {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    this._initState()
  }

  // ------------------------------------
  // Universal
  // ------------------------------------

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

  // ------------------------------------
  // Local storage
  // ------------------------------------

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
    if (value === 'false') {
      return false
    }

    return isJson ? JSON.parse(value) : value
  }

  // ------------------------------------
  // Cookies
  // ------------------------------------

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
    if (!this.options.cookie || (process.server && !this.ctx.req)) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const cookieStr = process.browser
      ? document.cookie
      : this.ctx.req.headers.cookie

    const cookies = parseCookie(cookieStr || '') || {}
    const value = cookies[_key]
    if (value === 'false') {
      return false
    }
    return isJson ? JSON.parse(value) : value
  }
}
