import Cookie from 'cookie'
import Cookies from 'js-cookie'
import getProp from 'dotprop'
import Vue from 'vue'

export default class Auth {
  constructor (ctx, options) {
    this.ctx = ctx
    this.app = ctx.app
    this.options = options

    // Error listeners
    this._errorListeners = []

    // Keep token out of the store for security reasons
    Vue.set(this, 'token', null)

    // Reset on error
    if (this.options.resetOnError) {
      this._resetOnError()
    }

    this._registerVuexStore()
  }

  _registerVuexStore () {
    const authModule = {
      namespaced: true,
      state: () => ({
        user: null,
        loggedIn: false
      }),
      mutations: {
        SET (state, payload) {
          Vue.set(state, payload.key, payload.value)
        }
      }
    }

    this.$store.registerModule(this.options.namespace, authModule, {
      preserveState: Boolean(this.$store.state[this.options.namespace])
    })
  }

  _resetOnError () {
    this.onError(() => {
      this.reset()
    })
  }

  _watchLoggedIn () {
    return this.$store.watch(
      () => this.$store.stat[this.options.namespace + '/loggedIn'],
      newAuthState => {
        if (newAuthState) {
          this.redirectToHome()
        } else {
          this.redirectToLogin()
        }
      }
    )
  }

  onError (listener) {
    this._errorListeners.push(listener)
  }

  _onError () {
    for (let fn of this._errorListeners) {
      fn.apply(this, arguments)
    }
  }

  get $axios () {
    if (!this.app.$axios) {
      throw new Error('$axios is not available')
    }

    return this.app.$axios
  }

  get $store () {
    return this.ctx.store
  }

  get $req () {
    return this.app.context.req
  }

  get $res () {
    return this.app.context.res
  }

  get isAPIRequest () {
    return (
      process.server &&
      this.$req.url.indexOf(this.options.endpoints.user.url) === 0
    )
  }

  get state () {
    return this.$store.state[this.options.namespace]
  }

  reset () {
    this.setState('loggedIn', false)
    this.setState('token', null)
    this.setState('user', null)

    if (this.options.cookie) {
      this.setCookie(this.options.cookie.name, null)
    }

    if (this.options.token.localStorage) {
      this.setLocalStorage(this.options.token.name, null)
    }
  }

  setState (key, value) {
    if (key === 'token') {
      this.token = value
      return
    }

    this.$store.commit(this.options.namespace + '/SET', { key, value })
  }

  getState (key) {
    if (key === 'token') {
      return this.token
    }

    return this.state[key]
  }

  setLocalStorage (name, value) {
    if (typeof localStorage !== 'undefined') {
      if (value) {
        localStorage.setItem(name, value)
      } else {
        localStorage.removeItem(name)
      }
    }
  }

  getLocalStorage (name) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(name)
    }
  }

  setCookie (name, value, params = {}) {
    if (!this.options.cookie) {
      return
    }

    const _params = Object.assign({}, this.options.cookie.params, params)

    if (!value) {
      let date = new Date()
      date.setDate(date.getDate() - 1)
      _params.expires = date
    }

    if (process.browser) {
      Cookies.set(name, value, _params)
    } else {
      // Don't send duplicate token via Set-Cookie
      if (!value) {
        this.$res.setHeader(
          'Set-Cookie',
          Cookie.serialize(name, value, _params)
        )
      }
    }
  }

  getCookie (name) {
    const cookieStr = process.browser
      ? document.cookie
      : this.$req.headers.cookie

    const cookies = Cookie.parse(cookieStr || '') || {}

    return cookies[name]
  }

  async _request (name, endpoint) {
    if (!this.options.endpoints[name]) {
      return
    }

    const opts = Object.assign({}, this.options.endpoints[name], endpoint)

    try {
      const { data } = await this.$axios.request(opts)
      return opts.propertyName ? getProp(data, opts.propertyName) : data
    } catch (err) {
      this._onError({ name, err, endpoint })
    }
  }

  async login (endpoint) {
    const data = await this._request('login', endpoint)
    if (!data) {
      return
    }

    // Extract and set token
    this.setToken(data)

    // Fetch User
    if (this.options.fetchUserOnLogin && this.options.endpoints.user) {
      return this.fetchUser()
    }

    // Set loggedIn to true
    this.setState('loggedIn', true)
  }

  async fetchUser (endpoint) {
    if (this.options.token && !this.getState('token')) {
      return
    }

    const data = await this._request('user', endpoint)
    if (!data) {
      return
    }

    this.setState('user', data)
    this.setState('loggedIn', true)
  }

  async logout (endpoint) {
    await this._request('logout', endpoint)

    this.reset()
  }

  setToken (token) {
    if (!this.options.token) {
      return
    }

    // Update local state
    this.setState('token', token)

    // Set Authorization token for all axios requests
    this.$axios.setToken(token, this.options.token.type)

    // Save it in cookies
    if (this.options.cookie) {
      this.setCookie(this.options.cookie.name, token)
    }

    // Save it in localSotage
    if (this.options.token.localStorage) {
      this.setLocalStorage(this.options.token.name, token)
    }
  }

  syncToken () {
    if (!this.options.token) {
      return
    }

    let token = this.getState('token')

    if (!token && this.options.cookie) {
      token = this.getCookie(this.options.cookie.name)
    }

    if (!token && this.options.token.localStorage) {
      token = this.getLocalStorage(this.options.token.name)
    }

    this.setToken(token)
  }

  redirect () {
    if (this.getState('loggedIn')) {
      this.redirectToHome()
    } else {
      this.redirectToLogin()
    }
  }

  redirectToLogin () {
    if (this.options.redirect.login) {
      this.ctx.redirect(this.options.redirect.login)
    }
  }

  redirectToHome () {
    if (this.options.redirect.home) {
      this.ctx.redirect(this.options.redirect.home)
    }
  }
}
