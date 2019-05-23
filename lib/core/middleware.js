import Middleware from '../middleware'
import { routeOption, getMatchedComponents, normalizePath } from './utilities'

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

  if (ctx.app.$auth.$state.loggedIn) {
    // -- Authorized --
    // Redirect to home page if:
    // - inside login page
    // - login page disabled
    // - options: { auth: 'guest' } is set on the page
    if (!login || normalizePath(ctx.route.path) === normalizePath(login) || routeOption(ctx.route, 'auth', 'guest')) {
      ctx.app.$auth.redirect('home')
    }
  } else {
    // -- Guest --
    // Redirect to login page if not authorized and not inside callback page
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
    if (!callback || normalizePath(ctx.route.path) !== normalizePath(callback)) {
      ctx.app.$auth.redirect('login')
    }
  }
}
