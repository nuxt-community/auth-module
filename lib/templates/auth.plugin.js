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

  // Initialize auth
  return $auth
    .init()
    .catch(process.server ? () => { } : console.error)
}
