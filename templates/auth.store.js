import Cookie from 'cookie'
import Cookies from 'js-cookie'

const options = <%= serialize(options) %>

export default {
  namespaced: true,

  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    loggedIn (state) {
      return Boolean(state.user || state.token)
    }
  },

  mutations: {
    // SET_USER
    SET_USER (state, user) {
      state.user = user
    },

    // SET_TOKEN
    SET_TOKEN (state, token) {
      state.token = token
    }
  },

  actions: {
    updateToken ({ commit }, token) {
      // Update state
      commit('SET_TOKEN', token)

      // Update localStorage
      if (process.browser && localStorage) {
        if (token) {
          localStorage.setItem('nuxt::auth::token', token)
        } else {
          localStorage.removeItem('nuxt::auth::token')
        }
      }

      // Update cookies
      if (process.browser) {
        // ...Browser
        if (token) {
          Cookies.set('token', token)
        } else {
          Cookies.remove('token')
        }
      } else {
        // ...Server
        // TODO: Use set-cookie header for this.$ctx.res
      }
    },

    fetchToken ({ dispatch }) {
      let token

      // First try localStorage
      if (process.browser && localStorage) {
        token = localStorage.getItem('nuxt::auth::token')
      }

      // Then try to extract token from cookies
      if (!token) {
        const cookieStr = process.browser ? document.cookie : this.$ctx.req.headers.cookie
        const cookies = Cookie.parse(cookieStr || '') || {}
        token = cookies.token
      }

      if (token) {
        dispatch('updateToken', token)
      }
    },

    async invalidate ({ dispatch, commit }) {
      commit('SET_USER', null)
      await dispatch('updateToken', null)
    },

    async fetch ({ state, commit, dispatch }) {
      let {endpoint, propertyName, paramTokenName, appendToken} = options.user
      // Append token
      if (appendToken) {
        paramTokenName = (paramTokenName) ? ('?' + paramTokenName + '=') : '/';
        endpoint = endpoint + paramTokenName + state.token
      }
      // Fetch and update latest token
      await dispatch('fetchToken')

      // Not loggedIn
      if (!state.token) {
        return
      }

      // Try to get user profile
      try {
        const headers = {'Authorization': options.tokenType + ' ' + state.token}
        const userData = await this.$axios.$get(endpoint, {headers})

        if (propertyName) {
          commit('SET_USER', userData[propertyName])
        } else {
          commit('SET_USER', userData)
        }
      } catch (e) {
        return dispatch('invalidate')
      }
    },

    // Login
    async login ({ commit, dispatch }, { fields } = {}) {
      let {endpoint, propertyName} = options.login
      // Send credentials to API
      let tokenData = await this.$axios.$post(endpoint, fields)
      let token = tokenData[propertyName]

      // Update new token
      await dispatch('updateToken', token)

      // Fetch authenticated user
      await dispatch('fetch')
    },

    // Logout
    async logout ({ commit, dispatch, state }) {
      let {endpoint, method, paramTokenName, appendToken} = options.logout
      // Append token
      if (appendToken) {
        paramTokenName = (paramTokenName) ? ('?' + paramTokenName + '=') : '/';
        endpoint = endpoint + paramTokenName + state.token
      }

      // Server side logout
      try {
        const headers = {'Authorization': options.tokenType + ' ' + state.token}

        if (method.toUpperCase() === 'POST') {
          await this.$axios.$post(endpoint, {}, {headers})
        } else {
          await this.$axios.$get(endpoint, {headers})
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while logging out', e)
      }

      // Unload user profile & token
      await dispatch('invalidate')
    }
  }
}
