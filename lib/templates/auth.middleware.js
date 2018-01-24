import middleware from './middleware'

middleware.auth = function authMiddleware ({ route, redirect, store }) {
  route.matched.some((currentRoute) => {
    // Retriving Auth Guard status through route's component options.
    const options = currentRoute.components.default.options
    const guarded = options.guarded

    // Only apply the middleware to guarded routes
    if (guarded) {
      // Checking if guest redirection middleware is enabled
    <% if (options.redirect.guest) { %>
        // Guest is redirected back to login page
        // and excluding redirected paths from hitting the middleware again.
        if (!store.getters['auth/loggedIn'] && route.path !== '<%= options.redirect.notLoggedIn %>') {
          return redirect('<%= options.redirect.notLoggedIn %>')
        }

        // Checking if user redirection middleware is enabled
      <% } if (options.redirect.user) { %>
        // Guest is redirected back to login page
        // and excluding redirected paths from hitting the middleware again.
        if (store.getters['auth/loggedIn'] && route.path !== '<%= options.redirect.loggedIn %>') {
          return redirect('<%= options.redirect.loggedIn %>')
        }
      <% } %>
    }
  });
}
