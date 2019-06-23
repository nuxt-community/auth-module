import Auth from './auth'

import './middleware'

// Active schemes
<%= options.uniqueSchemes.map(path =>`import ${'scheme_' + hash(path)} from '${path.replace(/\\/g,'/')}'`).join('\n') %>

export default function (ctx, inject) {
  // Options
  const options = <%= JSON.stringify(options.options) %>

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Register strategies
  <%=
  options.strategies.map(strategy => {
    const scheme = 'scheme_' + hash(options.strategyScheme.get(strategy))
    const schemeOptions = JSON.stringify(strategy)
    const name = strategy._name
    return `// ${name}\n  $auth.registerStrategy('${name}', new ${scheme}($auth, ${schemeOptions}))`
  }).join('\n\n  ')
  %>

  // Inject it to nuxt context as $auth
  inject('auth', $auth)
  ctx.$auth = $auth

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.client) {
      console.error('[ERROR] [AUTH]', error)
    }
  })
}
