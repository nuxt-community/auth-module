import requrl from 'requrl'
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
  public req

  constructor ($auth, options) {
    super($auth, options, DEFAULTS)

    this.req = $auth.ctx.req
  }

  mounted () {
    if (process.server) {
      this.$auth.ctx.$axios.setHeader('referer', requrl(this.req))
    }

    return super.mounted()
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
      await this.$auth.request(this.options.endpoints.csrf, {
        maxRedirects: 0
      })
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
