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

  const { login } = ctx.app.$auth.options.redirect

  if (ctx.app.$auth.$state.loggedIn) {
    // -- Authorized --
    // Redirect to home page if inside login page
    if (login && ctx.route.path === login.split('?')[0]) {
      ctx.app.$auth.redirect('home')
    }
  } else {
    // -- Guest --
    // Redirect to login path if not authorized
    ctx.app.$auth.redirect('login')
  }
}
