import { AuthPlugin } from '../inc/AuthPlugin'
import { isSet } from '../utils'

export class RequestHandlerPlugin extends AuthPlugin {
  setHeader (token) {
    if (this.$auth.strategy.options.token.global) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, token)
    }
  }

  clearHeader () {
    if (this.$auth.strategy.options.token.global) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.$auth.strategy.options.token.name, false)
    }
  }

  request (endpoint, defaults) {
    const _endpoint =
      typeof defaults === 'object'
        ? Object.assign({}, defaults, endpoint)
        : endpoint

    if (!this.ctx.app.$axios) {
      // eslint-disable-next-line no-console
      console.error('[AUTH] add the @nuxtjs/axios module to nuxt.config file')
      return
    }

    return this.ctx.app.$axios
      .request(_endpoint)
      .then(response => ({
        response,
        data: response.data
      }))
      .catch(error => {
        // Call all error handlers
        this.callOnError(error, { method: 'request' })

        // Throw error
        return Promise.reject(error)
      })
  }

  requestWith (strategy, endpoint, defaults) {
    const token = this.token.get()

    const _endpoint = Object.assign({}, defaults, endpoint)

    const tokenName = this.strategies[strategy].options.tokenName || 'Authorization'
    if (!_endpoint.headers) {
      _endpoint.headers = {}
    }
    if (!_endpoint.headers[tokenName] && isSet(token) && token) {
      _endpoint.headers[tokenName] = token
    }

    return this.request(_endpoint)
  }
}
