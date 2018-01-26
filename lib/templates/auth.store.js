<% if (options.token.enabled && options.token.cookie) { %>
import Cookie from 'cookie'
import Cookies from 'js-cookie'
<% } %>

export default {
  namespaced: true,

  state: () => ({
    <% if (options.token.enabled) { %>token: null,<% } %>
    <% if (options.user.enabled) { %>user: null<% } %>
  }),

  getters: {
    loggedIn(state) {
      return Boolean(
        true
        <% if (options.user.enabled) { %>&& state.user<% } %>
        <% if (options.token.enabled) { %>&& state.token<% } %>
      )
    }
  },

  mutations: {
    <% if (options.user.enabled) { %>
    // SET_USER
    SET_USER (state, user) {
      state.user = user
    },
    <% } %>

    <% if (options.token.enabled) { %>
    // SET_TOKEN
    SET_TOKEN (state, token) {
      state.token = token
    }
    <% } %>
  },

  actions: {
    <% if (options.token.enabled) { %>
    // Update token
    async updateToken ({ commit }, token) {
      // Update token in store's state
      commit('SET_TOKEN', token)

      // Set Authorization token for all axios requests
      this.$axios.setToken(token, '<%= options.token.type %>')

      <% if (options.token.localStorage) { %>
      // Update localStorage
      if (process.browser && localStorage) {
        if (token) {
          localStorage.setItem('<%= options.token.name %>', token)
        } else {
          localStorage.removeItem('<%= options.token.name %>')
        }
      }
      <% } %>

      <% if (options.token.cookie) { %>
      // Update cookies
      if (process.browser) {
        // ...Browser
        if (token) {
          Cookies.set('<%= options.token.cookieName %>', token)
        } else {
          Cookies.remove('<%= options.token.cookieName %>')
        }
      } else {
        // ...Server
        let params = {
          domain: '/'
        }
        if (!token) {
          let expires
          let date = new Date()
          expires = date.setDate(date.getDate() - 1)
          params.expires = new Date(expires)
        }
        this.app.context.res.setHeader('Set-Cookie', Cookie.serialize('<%= options.token.cookieName %>', token, params))
      }
      <% } %>
    },
    <% } %>

    <% if (options.token.enabled) { %>
    // Fetch Token
    async fetchToken ({ dispatch }) {
      let token

      <% if (options.token.localStorage) { %>
      // Try to extract token from localStorage
      if (process.browser && localStorage) {
        token = localStorage.getItem('<%= options.token.name %>')
      }
      <% } %>

      <% if (options.token.cookie) { %>
      // Try to extract token from cookies
      if (!token) {
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
        const cookies = Cookie.parse(cookieStr || '') || {}
        token = cookies['<%= options.token.cookieName %>']
      }
      <% } %>

      if (token) {
        await dispatch('updateToken', token)
      }
    },
    <% } %>

    // Reset
    async reset ({ dispatch, commit }) {
      <% if (options.user.enabled) { %>commit('SET_USER', null)<% } %>
      <% if (options.token.enabled) { %>await dispatch('updateToken', null)<% } %>
    },

    <% if (options.user.enabled) { %>
    // Fetch
    async fetch ({ getters, state, commit, dispatch }, { endpoint = '<%= options.user.endpoint %>' } = {}) {
      <% if (options.token.enabled) { %>
      // Fetch and update latest token
      await dispatch('fetchToken')

      // Skip if there is no token set
      if (!state.token) {
        return
      }
      <% } %>

      // Try to get user profile
      try {
        const data = await this.$axios.$<%= options.user.method.toLowerCase() %>(endpoint)
        commit('SET_USER', data<%= options.user.propertyName ? ('[\'' + options.user.propertyName + '\']') : '' %>)
      } catch (e) {
        console.error(e)
        <% if (options.errorHandler.fetch) { %>
          await options.errorHandler.fetch(this, e)
        <% } %>
        <% if (options.user.resetOnFail) { %>
        // Reset store
        await dispatch('reset')
        <% } %>
      }
    },
    <% } %>

    // Login
    async login ({ dispatch }, { fields, endpoint = '<%= options.login.endpoint %>' } = {}) {
      // Send credentials to API
      let data = await this.$axios.$post(endpoint, fields)

      <% if (options.token.enabled) { %>
      await dispatch('updateToken', data.<%= options.token.name %>)
      <% } %>

      // Fetch authenticated user
      <% if (options.user.enabled) { %>
      await dispatch('fetch')
      <% } %>
    },

    // Logout
    async logout ({ dispatch, state }, { endpoint = '<%= options.logout.endpoint %>' } = {}) {
      // Server side logout
      try {
        await this.$axios.$<%= options.logout.method.toLowerCase() %>(endpoint)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while logging out', e)
        <% if (options.errorHandler.logout) { %>
        await options.errorHandler.logout(this, e)
        <% } %>
      }

      // Reset store
      await dispatch('reset')
    }
  }
}
