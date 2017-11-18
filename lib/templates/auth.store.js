<% if (options.token.enabled && options.token.cookie) { %>
import Cookie from 'cookie'
import Cookies from 'js-cookie'
<% } %>

export default {
  namespaced: true,

  state: () => ({
    <% if (options.token.enabled) { %>token: null,<% } %>
    user: null
  }),

  getters: {
    loggedIn (state) {
      return Boolean(state.user<% if (options.token.enabled) { %> && state.token<% } %>)
    }
  },

  mutations: {
    // SET_USER
    SET_USER (state, user) {
      state.user = user
    },

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
    updateToken ({ commit }, token) {
      // Update token in store's state
      commit('SET_TOKEN', token)

      // Set Authorization token for all axios requests
      this.$axios.setToken(token, '<%= options.token.type %>');

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
        this.$ctx.res.setHeader('Set-Cookie', Cookie.serialize('<%= options.token.cookieName %>', token, params))
      }
      <% } %>
    },
    <% } %>

    <% if (options.token.enabled) { %>
    // Fetch Token
    fetchToken ({ dispatch }) {
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
        const cookieStr = process.browser ? document.cookie : this.$ctx.req.headers.cookie
        const cookies = Cookie.parse(cookieStr || '') || {}
        token = cookies['<%= options.token.cookieName %>']
      }
      <% } %>

      if (token) {
        dispatch('updateToken', token)
      }
    },
    <% } %>

    // Reset
    reset ({ dispatch, commit }) {
      commit('SET_USER', null)
      <% if (options.token.enabled) { %>dispatch('updateToken', null)<% } %>
    },

    // Fetch
    async fetch ({ getters, state, commit, dispatch }, { endpoint = '<%= options.user.endpoint %>' } = {}) {
      <% if (options.token.enabled) { %>
      // Fetch and update latest token
      dispatch('fetchToken')

      // Skip if there is no token set
      if (!state.token) {
        return
      }
      <% } %>

      // Try to get user profile
      try {
        const data = await this.$axios.$get(endpoint)
        commit('SET_USER', data<%= options.user.propertyName ? ('[\'' + options.user.propertyName + '\']') : '' %>)
      } catch (e) {
        // Reset store
        dispatch('reset')
      }
    },

    // Login
    async login ({ dispatch }, { fields, endpoint = '<%= options.login.endpoint %>' } = {}) {
      // Send credentials to API
      let data = await this.$axios.$post(endpoint, fields)

      <% if (options.token.enabled) { %>
      dispatch('updateToken', data['<%= options.token.name %>'])
      <% } %>

      // Fetch authenticated user
      await dispatch('fetch')
    },

    // Logout
    async logout ({ dispatch, state }, { endpoint = '<%= options.logout.endpoint %>' } = {}) {
      // Server side logout
      try {
        await this.$axios.$<%= options.logout.method.toLowerCase() %>(endpoint)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while logging out', e)
      }

      // Reset store
      dispatch('reset')
    }
  }
}
