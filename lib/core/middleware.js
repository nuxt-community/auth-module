import Middleware from '../middleware'
import { routeOption, getMatchedComponents } from './utilities'

Middleware.auth = function (ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(ctx.route, 'auth', false)) {
    return
  }

  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(ctx.route, matches)
  if (!Components.length) {
    return
  }

  const { login, callback } = ctx.app.$auth.options.redirect
  const splitPath = path => {
    // remove query string
    let result = path.split('?')[0]
    // remove redundant / from the end of path
    if (result.charAt(result.length - 1) === '/') {
      result = result.slice(0, -1)
    }
    return result
  }
  if (ctx.app.$auth.$state.loggedIn) {
    // -- Authorized --
    // Redirect to home page if inside login page (or login page disabled)
    if (!login || splitPath(ctx.route.path) === login) {
      ctx.app.$auth.redirect('home')
    }
  } else {
    // -- Guest --
    // Redirect to login page if not authorized and not inside callback page
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
    if (!callback || ctx.route.path !== callback.split('?')[0]) {
      ctx.app.$auth.redirect('login')
    }
  }
}
