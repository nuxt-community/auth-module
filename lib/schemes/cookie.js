import defu from 'defu'
import LocalScheme from './local'

export default class CookieScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))
  }

  check () {
    if (!super.check()) {
      return false
    }

    if (this.options.cookie.name) {
      const cookies = this.$auth.$storage.getCookies()
      return Boolean(cookies[this.options.cookie.name])
    }

    return true
  }

  async login (endpoint) {
    // Make CSRF request if required
    if (this.options.endpoints.csrf) {
      await this.$auth.request(this.options.endpoints.csrf)
    }

    return super.login(endpoint)
  }

  async logout (endpoint) {
    await super.logout(endpoint)

    if (this.options.cookie.name) {
      this.$auth.$storage.setCookie(this.options.cookie.name, null, { prefix: '' })
    }
  }
}

const DEFAULTS = {
  cookie: {
    name: 'XSRF-TOKEN'
  },
  token: {
    type: '',
    property: '.status'
  },
  endpoints: {
    csrf: null
  }
}
