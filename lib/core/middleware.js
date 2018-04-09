import Middleware from '../middleware'
import { routeOption } from './utilities'

Middleware.auth = function (ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(ctx.route, 'auth', false)) {
    return
  }

  const { login } = ctx.app.$auth.options.redirect

  if (ctx.app.$auth.$state.loggedIn) {
    // -- Authorized --
    // Redirect to home page if inside login page
    if (login && typeof login === String && ctx.route.path === login.split('?')[0]) {
      ctx.app.$auth.redirect('home')
    }
  } else if (login && typeof login === function) {
    // -- Guest --
    // Call configured function to handle guest accessing a page requiring authentication
    login(ctx)
  } else {
    // -- Guest --
    // Redirect to login path if not authorized
    ctx.app.$auth.redirect('login')
  }
}
