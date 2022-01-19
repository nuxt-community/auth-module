import type { Context } from '@nuxt/types'
import Vue from 'vue'
import cookie from 'cookie'
import type { ModuleOptions } from '../options'
import { isUnset, isSet, decodeValue, encodeValue, getProp } from '../utils'

// TODO: Normalize type at module itself
export type StorageOptions = ModuleOptions & {
  initialState: {
    user: null
    loggedIn: boolean
  }
}

// TODO: Improve type of storages: Universal / Cookie / Local / State

export class Storage {
  public ctx: Context
  public options: StorageOptions

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _state: any
  private _useVuex: boolean

  constructor(ctx: Context, options: StorageOptions) {
    this.ctx = ctx
    this.options = options

    this._initState()
  }

  // ------------------------------------
  // Universal
  // ------------------------------------

  setUniversal<V extends unknown>(key: string, value: V): V | void {
    // Unset null, undefined
    if (isUnset(value)) {
      return this.removeUniversal(key)
    }

    // Cookies
    this.setCookie(key, value)

    // Local Storage
    this.setLocalStorage(key, value)

    // Local state
    this.setState(key, value)

    return value
  }

  getUniversal(key: string): unknown {
    let value

    // Local state
    if (process.server) {
      value = this.getState(key)
    }

    // Cookies
    if (isUnset(value)) {
      value = this.getCookie(key)
    }

    // Local Storage
    if (isUnset(value)) {
      value = this.getLocalStorage(key)
    }

    // Local state
    if (isUnset(value)) {
      value = this.getState(key)
    }

    return value
  }

  syncUniversal(key: string, defaultValue?: unknown): unknown {
    let value = this.getUniversal(key)

    if (isUnset(value) && isSet(defaultValue)) {
      value = defaultValue
    }

    if (isSet(value)) {
      this.setUniversal(key, value)
    }

    return value
  }

  removeUniversal(key: string): void {
    this.removeState(key)
    this.removeLocalStorage(key)
    this.removeCookie(key)
  }

  // ------------------------------------
  // Local state (reactive)
  // ------------------------------------

  _initState(): void {
    // Private state is suitable to keep information not being exposed to Vuex store
    // This helps prevent stealing token from SSR response HTML
    Vue.set(this, '_state', {})

    // Use vuex for local state's if possible
    this._useVuex = this.options.vuex && !!this.ctx.store

    if (this._useVuex) {
      const storeModule = {
        namespaced: true,
        state: () => this.options.initialState,
        mutations: {
          SET(state, payload) {
            Vue.set(state, payload.key, payload.value)
          }
        }
      }

      this.ctx.store.registerModule(this.options.vuex.namespace, storeModule, {
        preserveState: Boolean(
          this.ctx.store.state[this.options.vuex.namespace]
        )
      })

      this.state = this.ctx.store.state[this.options.vuex.namespace]
    } else {
      Vue.set(this, 'state', {})

      // eslint-disable-next-line no-console
      console.warn(
        '[AUTH] The Vuex Store is not activated. This might cause issues in auth module behavior, like redirects not working properly.' +
          'To activate it, see https://nuxtjs.org/docs/2.x/directory-structure/store'
      )
    }
  }

  setState<V extends unknown>(key: string, value: V): V {
    if (key[0] === '_') {
      Vue.set(this._state, key, value)
    } else if (this._useVuex) {
      this.ctx.store.commit(this.options.vuex.namespace + '/SET', {
        key,
        value
      })
    } else {
      Vue.set(this.state, key, value)
    }

    return value
  }

  getState(key: string): unknown {
    if (key[0] !== '_') {
      return this.state[key]
    } else {
      return this._state[key]
    }
  }

  watchState(
    key: string,
    fn: (value: unknown, oldValue: unknown) => void
  ): () => void {
    if (this._useVuex) {
      return this.ctx.store.watch(
        (state) => getProp(state[this.options.vuex.namespace], key),
        fn
      )
    }
  }

  removeState(key: string): void {
    this.setState(key, undefined)
  }

  // ------------------------------------
  // Local storage
  // ------------------------------------

  setLocalStorage<V extends unknown>(key: string, value: V): V | void {
    // Unset null, undefined
    if (isUnset(value)) {
      return this.removeLocalStorage(key)
    }

    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key

    try {
      localStorage.setItem(_key, encodeValue(value))
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        throw e
      }
    }

    return value
  }

  getLocalStorage(key: string): unknown {
    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key

    const value = localStorage.getItem(_key)

    return decodeValue(value)
  }

  removeLocalStorage(key: string): void {
    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key

    localStorage.removeItem(_key)
  }

  // ------------------------------------
  // Cookies
  // ------------------------------------
  getCookies(): Record<string, unknown> {
    if (!this.isCookiesEnabled()) {
      return
    }
    const cookieStr = process.client
      ? document.cookie
      : this.ctx.req.headers.cookie

    return cookie.parse(cookieStr || '') || {}
  }

  setCookie<V extends unknown>(
    key: string,
    value: V,
    options: { prefix?: string } = {}
  ): V {
    if (!this.options.cookie || (process.server && !this.ctx.res)) {
      return
    }

    if (!this.isCookiesEnabled()) {
      return
    }

    const _prefix =
      options.prefix !== undefined ? options.prefix : this.options.cookie.prefix
    const _key = _prefix + key
    const _options = Object.assign({}, this.options.cookie.options, options)
    const _value = encodeValue(value)

    // Unset null, undefined
    if (isUnset(value)) {
      _options.maxAge = -1
    }

    // Accept expires as a number for js-cookie compatiblity
    if (typeof _options.expires === 'number') {
      _options.expires = new Date(Date.now() + _options.expires * 864e5)
    }

    const serializedCookie = cookie.serialize(_key, _value, _options)

    if (process.client) {
      // Set in browser
      document.cookie = serializedCookie
    } else if (process.server && this.ctx.res) {
      // Send Set-Cookie header from server side
      let cookies = (this.ctx.res.getHeader('Set-Cookie') as string[]) || []
      if (!Array.isArray(cookies)) cookies = [cookies]
      cookies.unshift(serializedCookie)
      this.ctx.res.setHeader(
        'Set-Cookie',
        cookies.filter(
          (v, i, arr) =>
            arr.findIndex((val) =>
              val.startsWith(v.substr(0, v.indexOf('=')))
            ) === i
        )
      )
    }

    return value
  }

  getCookie(key: string): unknown {
    if (!this.options.cookie || (process.server && !this.ctx.req)) {
      return
    }

    if (!this.isCookiesEnabled()) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const cookies = this.getCookies()

    const value = cookies[_key]
      ? decodeURIComponent(cookies[_key] as string)
      : undefined

    return decodeValue(value)
  }

  removeCookie(key: string, options?: { prefix?: string }): void {
    this.setCookie(key, undefined, options)
  }

  getPrefix(): string {
    if (!this.options.localStorage) {
      throw new Error('Cannot get prefix; localStorage is off')
    }
    return this.options.localStorage.prefix
  }

  isLocalStorageEnabled(): boolean {
    // Disabled by configuration
    if (!this.options.localStorage) {
      return false
    }

    // Local Storage only exists in the browser
    if (!process.client) {
      return false
    }

    // There's no great way to check if localStorage is enabled; most solutions
    // error out. So have to use this hacky approach :\
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const test = 'test'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        // eslint-disable-next-line no-console
        console.warn(
          "[AUTH] Local storage is enabled in config, but browser doesn't" +
            ' support it'
        )
      }
      return false
    }
  }

  isCookiesEnabled(): boolean {
    // Disabled by configuration
    if (!this.options.cookie) {
      return false
    }

    // Server can only assume cookies are enabled, it's up to the client browser
    // to create them or not
    if (process.server) {
      return true
    }

    if (window.navigator.cookieEnabled) {
      return true
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "[AUTH] Cookies is enabled in config, but browser doesn't" +
          ' support it'
      )
      return false
    }
  }
}
