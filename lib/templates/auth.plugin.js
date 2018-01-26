import './auth.middleware'
import authStore from './auth.store'

export default async function (context, inject) {
  // Register auth store module
  context.store.registerModule('auth', authStore, {
    preserveState: Boolean(context.store.state.auth),
  })

  // Backward compability for Nuxt <= RC.11
  if (!context.store.app.context) {
    context.store.app.context = context
  }

  // Fetch initial state
  await context.store.dispatch('auth/fetch')

  // Redirect on login and logout
  context.store.watch(() => context.store.getters['auth/loggedIn'], newAuthState =>
  {
    if (newAuthState) {
      context.app.router.replace('<%= options.redirect.loggedIn %>')
      return
    }

    context.app.router.replace('<%= options.redirect.notLoggedIn %>')
  })
}
