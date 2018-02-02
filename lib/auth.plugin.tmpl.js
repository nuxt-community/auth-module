import Auth from './auth'
import Middleware from './middleware'

export default function (ctx, inject) {
  // Create  new Auth instance
  const $auth = new Auth(ctx, <%= JSON.stringify(options, undefined, 2).replace(/"/g,'\'') %>)

  // Prevent infinity redirects
  if ($auth.isAPIRequest) {
    return
  }

  // Inject it to nuxt context as $auth
  inject('auth', $auth)

  // Sync token
  $auth.syncToken()

  // Watch for loggedIn changes only in client side
  if (process.browser) {
    $auth.watchLoggedIn()
  }

  // Fetch user if is not available
  if (!$auth.state.user) {
    return $auth.fetchUser()
  }
}

// Register auth middleware
Middleware.auth = function (ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(ctx.route, 'auth', false)) {
    return
  }

  const { login } = ctx.app.$auth.options.redirect

  if (ctx.app.$auth.state.loggedIn) {
    // -- Authotized --
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

// Utility to get route option
function routeOption (route, key, value) {
  return route.matched.some(m => {
    // Browser
    if (process.browser) {
      return Object.values(m.components).some(component => component.options[key] === value)
    }
    // SSR
    return Object.values(m.components).some(component =>
      Object.values(component._Ctor).some(ctor => ctor.options && ctor.options[key] === value)
    )
  })
}
