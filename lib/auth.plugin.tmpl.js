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

  // Fetch user if is not available
  if (!$auth.state.user) {
    return $auth.fetchUser()
  }
}

// Register auth middleware
Middleware.auth = function (ctx) {
  if (routeOption(ctx.route, 'guarded', false)) {
    return
  }

  ctx.app.$auth.redirect()
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
