import Cookie from 'cookie'
import Cookies from 'js-cookie'
import { kebabCase } from 'lodash'

const options = <%= serialize(options) %>
const storageTokenName = kebabCase(options.storageTokenName)

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
          localStorage.setItem(storageTokenName, token)
        } else {
          localStorage.removeItem(storageTokenName)
        }
      }

      // Update cookies
      if (process.browser) {
        // ...Browser
        if (token) {
          Cookies.set(storageTokenName, token)
        } else {
          Cookies.remove(storageTokenName)
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
        this.$ctx.res.setHeader('Set-Cookie', Cookie.serialize(storageTokenName, token, params))
      }
    },

    fetchToken ({ dispatch }) {
      let token

      // First try localStorage
      if (process.browser && localStorage) {
        token = localStorage.getItem(storageTokenName)
      }

      // Then try to extract token from cookies
      if (!token) {
        const cookieStr = process.browser ? document.cookie : this.$ctx.req.headers.cookie
        const cookies = Cookie.parse(cookieStr || '') || {}
        token = cookies[storageTokenName]
      }

      if (token) {
        dispatch('updateToken', token)
      }
    },

    invalidate ({ dispatch, commit }) {
      commit('SET_USER', null)
      dispatch('updateToken', null)
    },

    async fetch ({ state, commit, dispatch }) {
      let {endpoint, propertyName, paramTokenName, appendToken} = options.user

      // Fetch and update latest token
      dispatch('fetchToken')

      // Not loggedIn
      if (!state.token) {
        return
      }

      // Append token
      if (appendToken) {
        paramTokenName = (paramTokenName) ? ('?' + paramTokenName + '=') : '/'
        endpoint = endpoint + paramTokenName + state.token
      }

      // Try to get user profile
      try {
        // Set Authorization Token in request
        this.$axios.setToken(state.token, options.tokenType)

        const userData = await this.$axios.$get(endpoint)

        if (propertyName) {
          commit('SET_USER', userData[propertyName])
        } else {
          commit('SET_USER', userData)
        }
      } catch (e) {
        dispatch('invalidate')
      }
    },

    // Login
    async login ({ dispatch }, { fields } = {}) {
      let {endpoint, propertyName} = options.login

      // Send credentials to API
      let tokenData = await this.$axios.$post(endpoint, fields)
      let token = tokenData[propertyName]

      // Update new token
      dispatch('updateToken', token)

      // Fetch authenticated user
      await dispatch('fetch')
    },

    // Logout
    async logout ({ dispatch, state }) {
      let {endpoint, method, paramTokenName, appendToken} = options.logout

      // Append token
      if (appendToken) {
        paramTokenName = (paramTokenName) ? ('?' + paramTokenName + '=') : '/'
        endpoint = endpoint + paramTokenName + state.token
      }

      // Server side logout
      try {
        // Set Authorization Token in request
        this.$axios.setToken(state.token, options.tokenType);

        if (method.toUpperCase() === 'POST') {
          await this.$axios.$post(endpoint)
        } else {
          await this.$axios.$get(endpoint)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while logging out', e)
      }

      // Unload user profile & token
      dispatch('invalidate')
    }
  }
}
