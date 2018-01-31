import middleware from './middleware'

// Register auth middleware
middleware.auth = function ({ route, redirect, store }) {
  // Registering guest and auth routes.
  const guestRoute = '<%= options.redirect.notLoggedIn %>'
  const authRoute = '<%= options.redirect.loggedIn %>'

  // Skip if route is not guarded
  if (isRouteGuarded(route)) {
    return
  }

  // Redirect guest users to {notLoggedIn}
  <% if (options.redirect.guest) { %>
  if (!store.getters['auth/loggedIn'] && guestRoute !== route.path) {
      return redirect(guestRoute)
  }
  <% } %>

  // Redirect authenticated users to {loggedIn}
  <% if (options.redirect.user) { %>
  if (store.getters['auth/loggedIn'] && authRoute !== route.path) {
      return redirect(authRoute)
  }
  <% } %>
}

/**
 * isRouteGuarded utility
 * @param {*} route
 * @returns {boolean}
 */
function isRouteGuarded(route) {
  return route.matched.some(m => {
    // SSR
    if (process.server) {
      return Object.values(m.components)
        .some(component => Object.values(component._Ctor)
          .some(ctor => ctor.options && ctor.options.guarded))
    }
    // Client
    return Object.values(m.components)
      .some(component => component.options.guarded)
  })
}
