import type { SchemeCheck } from '../index'
import LocalScheme from './local'

const DEFAULTS = {
  name: 'cookie',
  cookie: {
    name: null
  },
  token: {
    type: '',
    property: '.status',
    maxAge: false,
    global: false
  },
  endpoints: {
    csrf: null
  }
}

export default class CookieScheme extends LocalScheme {
  constructor ($auth, options) {
    super($auth, options, DEFAULTS)
  }

  mounted () {
    if (process.server) {
      this.$auth.ctx.$axios.setHeader('referer', this.$auth.ctx.req.headers.host)
    }

    return super.mounted()
  }

  check (): SchemeCheck {
    const response = { valid: false }

    if (!super.check().valid) {
      return response
    }

    if (this.options.cookie.name) {
      const cookies = this.$auth.$storage.getCookies()
      response.valid = Boolean(cookies[this.options.cookie.name])
      return response
    }

    response.valid = true
    return response
  }

  async login (endpoint) {
    // Ditch any leftover local tokens before attempting to log in
    this.$auth.reset()

    // Make CSRF request if required
    if (this.options.endpoints.csrf) {
      await this.$auth.request(this.options.endpoints.csrf, {
        maxRedirects: 0
      })
    }

    return super.login(endpoint, { reset: false })
  }

  reset () {
    if (this.options.cookie.name) {
      this.$auth.$storage.setCookie(this.options.cookie.name, null, { prefix: '' })
    }

    return super.reset()
  }
}
