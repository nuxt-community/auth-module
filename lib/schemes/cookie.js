import defu from 'defu'
import LocalScheme from './local'

export default class CookieScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))
  }

  check () {
    const cookies = this.$auth.$storage.getCookies()
    return Boolean(cookies[this.options.cookie.name])
  }
}

const DEFAULTS = {
  cookie: {
    name: 'XSRF-TOKEN'
  },
  token: {
    required: false
  }
}
