import './auth.middleware'

import Auth from './auth.class'

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
