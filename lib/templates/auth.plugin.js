import './auth.middleware'
import authStore from './auth.store'

export default async function ({ store, req, res }, inject) {
  // Register auth store module
  store.registerModule('auth', authStore, {
    preserveState: !!store.state.auth,
  })

  // Fetch initial state
  await store.dispatch('auth/fetch', { req, res })
}
