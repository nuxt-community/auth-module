export default class RequestHandler {
  constructor (auth) {
    this.$auth = auth
  }

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
}
