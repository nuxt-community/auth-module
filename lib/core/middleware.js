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
  const pageIsInGuestMode = routeOption(ctx.route, 'auth', 'guest')
  const insideLoginPage = normalizePath(ctx.route.path) === normalizePath(login)
  const insideCallbackPage = normalizePath(ctx.route.path) !== normalizePath(callback)

  if (ctx.app.$auth.$state.loggedIn) {
    // -- Authorized --
    if (!login || insideLoginPage || pageIsInGuestMode) {
      ctx.app.$auth.redirect('home')
    }
  } else {
    // -- Guest --
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
    if (!pageIsInGuestMode && (!callback || insideCallbackPage)) {
      ctx.app.$auth.redirect('login')
    }
  }
}
