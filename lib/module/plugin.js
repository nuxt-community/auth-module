import Auth from './auth'

import './middleware'

// Active schemes
<%= options.uniqueSchemes.map(path =>`import ${'scheme_' + hash(path)} from '${path.replace(/\\/g,'/')}'`).join('\n') %>
<%= options.options.errorListeners.map(path =>`import ${'listener_' + hash(path)} from '${path.replace(/\\/g,'/')}'`).join('\n') %>

export default function (ctx, inject) {
  // Options
  const options = <%= JSON.stringify(options.options) %>

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Inject it to nuxt context as $auth
  inject('auth', $auth)

  // Load error listeners

  <%= options.options.errorListeners.map(path =>`$auth.onError(${'listener_' + hash(path)})`).join('\n') %>

  // Register strategies

  <%=
  options.strategies.map(strategy => {
    const scheme = 'scheme_' + hash(options.strategyScheme.get(strategy))
    const schemeOptions = JSON.stringify(strategy)
    const name = strategy._name
    return `// ${name}\n  $auth.registerStrategy('${name}', new ${scheme}($auth, ${schemeOptions}))`
  }).join('\n\n  ')
  %>

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.browser) {
      console.error('[ERROR] [AUTH]', error)
    }
  })
}
