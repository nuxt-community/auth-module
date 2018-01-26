import middleware from './middleware'

const isRouteGuarded = ({ route: { matched: m } }) =>
  m.some(({ components: c }) => process.server
    ? Object.values(c).some(({ _Ctor: _c }) =>
      Object.values(_c).some(({ options: o }) => o && o.guarded)
    )
    : Object.values(c).some(o => o.options.guarded)
  )


middleware.auth = function(context) {
  const { route: {path: p}, redirect: r, store: s } = context

  // Registering guest and auth routes.
  let guestRoute = '<%= options.redirect.notLoggedIn %>'
  let authRoute = '<%= options.redirect.loggedIn %>'

  // Retriving Auth Guard status through route's component options.
  let g = isRouteGuarded(context)
  // Apply the middleware to guarded routes
  if (g) {
    if (<%= options.redirect.guest %> && !s.getters['auth/loggedIn'] && guestRoute !== p) {
      return r(guestRoute)
    }

    if (<%= options.redirect.user %> && s.getters['auth/loggedIn'] && authRoute !== p) {
      return r(authRoute)
    }
  }
}
