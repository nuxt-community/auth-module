import Auth from './auth'

import './middleware'

// Active chemes
<%= options.schemes.map(scheme => `import ${'scheme_' + hash(scheme)} from '${scheme}'`).join('\n') %>

export default function (ctx, inject) {
  // Options
  const options = <%= JSON.stringify(options.options) %>

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Inject it to nuxt context as $auth
  inject('auth', $auth)

  // Register strategies
  <% for (let strategy of options.strategies) { %>
  $auth.registerStrategy('<%= strategy._name %>', new <%='scheme_' + hash(strategy._scheme) %> ($auth, <%= JSON.stringify(strategy) %>))
  <% } %>

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.browser) {
      console.error('[ERROR] [AUTH]', error)
    }
  })
}
