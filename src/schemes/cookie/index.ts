import LocalScheme from '../local'
import TokenableScheme from '../TokenableScheme'
import Auth from '../../core/auth'
import { HTTPRequest, HTTPResponse } from '../../index'
import { SchemePartialOptions, SchemeCheck } from '../index'
import CookieSchemeOptions from './contracts/CookieSchemeOptions'

const DEFAULTS: SchemePartialOptions<CookieSchemeOptions> = {
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

export default class CookieScheme<
    OptionsT extends CookieSchemeOptions = CookieSchemeOptions
  >
  extends LocalScheme<OptionsT>
  implements TokenableScheme<OptionsT> {
  constructor($auth: Auth, options: SchemePartialOptions<CookieSchemeOptions>) {
    super($auth, options, DEFAULTS)
  }

  mounted(): Promise<HTTPResponse | void> {
    if (process.server) {
      this.$auth.ctx.$axios.setHeader(
        'referer',
        this.$auth.ctx.req.headers.host
      )
    }

    return super.mounted()
  }

  check(): SchemeCheck {
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

  async login(endpoint: HTTPRequest): Promise<HTTPResponse> {
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

  reset(): void {
    if (this.options.cookie.name) {
      this.$auth.$storage.setCookie(this.options.cookie.name, null, {
        prefix: ''
      })
    }

    return super.reset()
  }
}
