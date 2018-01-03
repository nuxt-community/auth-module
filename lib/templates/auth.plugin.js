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
  <% if (options.user.enabled) { %>
  await context.store.dispatch('auth/fetch')
  <% } %>
  <% if (options.token.enabled) { %>
  await context.store.dispatch('auth/fetchToken')
  <% } %>
}
