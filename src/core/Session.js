
import Vue from 'vue'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import { isUnset, decodeValue, encodeValue } from './utilities'
import { AuthPlugin } from '../inc/AuthPlugin'

export default class SessionPlugin extends AuthPlugin {
  constructor (auth, options) {
    super(auth, options)

    Vue.set(this, 'data', {})
  }

  get (ns, key) {
    return (this.data[ns] || {})[key]
  }

  set (key, value) {
    Vue.set(this.state, key, value)
  }

  unset (key, value) {
    this.setState(key, undefined)
  }

  getCookies () {
    const cookieStr = process.client
      ? document.cookie
      : this.$auth.ctx.req.headers.cookie

    return parseCookie(cookieStr || '') || {}
  }

  setCookie (key, value, options = {}) {
    if (process.server && !this.$auth.ctx.res) {
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
