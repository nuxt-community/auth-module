import Auth from './auth'

import './middleware'

// Active chemes
<%= options.uniqueSchemes.map(path =>`import ${'scheme_' + hash(path)} from '${path.replace(/\\/g,'/')}'`).join('\n') %>

export default function (ctx, inject) {
  // Options
  const options = <%= JSON.stringify(options.options) %>

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Inject it to nuxt context as $auth
  inject('auth', $auth)

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
