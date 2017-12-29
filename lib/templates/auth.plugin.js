import './auth.middleware'
import authStore from './auth.store'

export default async function (context, inject) {
  // Register auth store module
  context.store.registerModule('auth', authStore, {
    preserveState: Boolean(context.store.state.auth),
  })

  // Backward compability for Nuxt <= RC.11
  if (!context.store.app) {
    context.store.app = {
      context
    }
  }

  // Fetch initial state
  await context.store.dispatch('auth/fetch')
}
