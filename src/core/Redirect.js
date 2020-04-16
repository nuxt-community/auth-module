import { AuthPlugin } from '../inc/AuthPlugin'
import { isRelativeURL, isSameURL } from '../utils'

export default class RedirectPlugin extends AuthPlugin {
  redirect (name, noRouter = false) {
    if (!this.options) {
      return
    }

    const from = this.options.fullPath ? this.$auth.ctx.route.fullPath : this.$auth.ctx.route.path

    let to = this.options.redirect[name]
    if (!to) {
      return
    }

    // Apply rewrites
    if (this.options.rewrite) {
      if (name === 'login' && isRelativeURL(from) && !isSameURL(to, from)) {
        this.$auth.$storage.setUniversal('redirect', from)
      }

      if (name === 'home') {
        const redirect = this.$storage.getUniversal('redirect')
        this.$auth.$storage.setUniversal('redirect', null)

        if (isRelativeURL(redirect)) {
          to = redirect
        }
      }
    }

    // TODO: Custom hook

    // Prevent infinity redirects
    if (isSameURL(to, from)) {
      return
    }

    if (process.client) {
      if (noRouter) {
        window.location.replace(to)
      } else {
        this.$auth.ctx.redirect(to, this.ctx.query)
      }
    } else {
      this.$auth.ctx.redirect(to, this.ctx.query)
    }
  }
}
