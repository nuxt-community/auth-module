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

    const cookies = this.$auth.$storage.getCookies()
    return Boolean(cookies[this.options.cookie.name])
  }

  async login (endpoint) {
    // Make CSRF request if required
    if (this.options.endpoints.csrf) {
      await this.$auth.request(this.options.endpoints.csrf)
    }

    return super.login(endpoint)
  }
}

const DEFAULTS = {
  cookie: {
    name: 'XSRF-TOKEN'
  },
  token: {
    required: false
  },
  endpoints: {
    csrf: null
  }
}
