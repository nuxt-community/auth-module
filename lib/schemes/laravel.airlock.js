import LocalScheme from './local'
import defu from 'defu'

export default class LaravelAirlockScheme extends LocalScheme {
  constructor (auth, options) {
    super(auth, defu(options, DEFAULTS))
  }

  async login (endpoint) {
    await this.$auth.request(this.options.endpoints.airlockCRSF)

    return super.login(endpoint)
  }
}

const DEFAULTS = {
  _name: 'laravel.airlock',
  endpoints: {
    airlockCRSF: {
      url: '/airlock/csrf-cookie',
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      withCredentials: true
    },
    login: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    },
    logout: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    },
    user: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  },
  token: {
    type: false,
    required: false
  },
  user: {
    property: false
  },
  clientId: false
}
