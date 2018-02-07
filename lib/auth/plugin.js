import Auth from './auth'
import './middleware'


export default function (ctx, inject) {
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

  // Initialize auth
  return $auth
    .init()
    .catch(process.server ? () => { } : console.error)
}
