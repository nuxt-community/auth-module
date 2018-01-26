import './auth.middleware'
import authStore from './auth.store'

export default async function ({ store, app }, inject) {
  // Register auth store module
  store.registerModule('auth', authStore, {
    preserveState: Boolean(store.state.auth),
  })

  // Fetch initial state
  await store.dispatch('auth/fetch')

  // Redirect on login and logout
  store.watch(() => store.getters['auth/loggedIn'], newAuthState => {
    if (newAuthState) {
      app.router.replace('<%= options.redirect.loggedIn %>')
      return
    }
    app.router.replace('<%= options.redirect.notLoggedIn %>')
  })
}
