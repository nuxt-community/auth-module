import './auth.middleware'
import authStore from './auth.store'

export default async function (ctx, inject) {
  const { store } = ctx

  // Inject $ctx
  inject('ctx', ctx)

  // Register auth store module
  store.registerModule('auth', authStore)

  // Fetch initial state
  try {
    await store.dispatch('auth/fetch')
  } catch (e) {
    // Not authorized
  }
}
