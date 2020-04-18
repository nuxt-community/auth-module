import { routeOption, getMatchedComponents, normalizePath } from '../utils'

export default async function authMiddleware (ctx) {
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

  const { login, callback } = ctx.$auth.options.redirect
  const pageIsInGuestMode = routeOption(ctx.route, 'auth', 'guest')
  const insidePage = page => normalizePath(ctx.route.path) === normalizePath(page)

  if (ctx.$auth.$state.loggedIn) {
    // -- Authorized --
    if (!login || insidePage(login) || pageIsInGuestMode) {
      ctx.$auth.redirect('home')
    }

    if (ctx.$auth.strategy &&
      ctx.$auth.strategy.options.token &&
      ctx.$auth.strategy.options.token.required) {
      // Sync tokens
      ctx.$auth.token.sync()
      const refreshToken = ctx.$auth.refreshToken.sync()
      const tokenStatus = ctx.$auth.token.status()
      const refreshTokenStatus = ctx.$auth.refreshToken.status()

      // Refresh token has expired. There is no way to refresh. Force reset.
      if (refreshTokenStatus.expired()) {
        await ctx.$auth.reset()
      } else if (tokenStatus.expired()) {
        // Token has expired.
        if (refreshToken) {
          // Refresh token is available. Attempt refresh.
          await ctx.$auth.refreshTokens()
        } else {
          // Refresh token is not available. Force reset.
          await ctx.$auth.reset()
        }
      }
    }
  } else {
    // -- Guest --
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
    if (!pageIsInGuestMode && (!callback || !insidePage(callback))) {
      ctx.$auth.redirect('login')
    }
  }
}
