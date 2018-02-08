import Auth from './auth'
import './middleware'

import localScheme from './schemes/local'

export default async function (ctx, inject) {
  // Options
  const options = <%= JSON.stringify(options, undefined, 2).replace(/"/g, '\'') %>

  // Create  new Auth instance
  const $auth = new Auth(ctx, options)

  // Prevent infinity redirects with loopback
  if (process.server && ctx.req.url.indexOf(options.endpoints.user.url) === 0) {
    return
  }

  // Inject it to nuxt context as $auth
  inject('auth', $auth)

  try {
    // Initialize auth
    await $auth.init()

    // Register local
    $auth.registerStrategy('local', localScheme({
      endpoints: options.endpoints,
      tokenRequired: Boolean(options.token)
    }))

    // Set local
    await $auth.setStrategy('local')

  } catch (error) {
    if (process.browser) {
      console.error('[Auth]', error)
    }
  }
}
