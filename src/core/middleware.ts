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

    // Perform scheme checks.
    // If token has expired, attempt `tokenCallback`.
    // If refresh token has expired, attempt `refreshTokenCallback`.
    await ctx.$auth.check(true, (isRefreshable) => {
      // Refresh token is available. Attempt refresh.
      if (isRefreshable) {
        return ctx.$auth.refreshTokens()
          .then(() => true)
          .catch(() => false)
      }

      // Refresh token is not available. Force reset.
      ctx.$auth.reset()
    }, () => {
      // Refresh token has expired. There is no way to refresh. Force reset.
      ctx.$auth.reset()
    })

    // -- Guest --
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
  } else if (!pageIsInGuestMode && (!callback || !insidePage(callback))) {
    ctx.$auth.redirect('login')
  }
}
