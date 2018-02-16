/**
 * Default auth scheme supporting token and cookie authentication flows.
 * @param {Object} endpoints
 * @param {Boolean} tokenRequired
 */
export default ({ endpoints, tokenRequired = true }) => ({
  mounted (auth) {
    return auth.fetchUser()
  },

  login (auth, endpoint) {
    if (!endpoints.login) {
      return Promise.resolve()
    }

    return auth.request(endpoint, endpoints.login)
      .then(data => {
        if (tokenRequired) {
          auth.setToken(data)
        }
      })
      .then(() => auth.fetchUser())
  },

  fetchUser (auth, endpoint) {
    // User endpoint is disabled. So we assueme loggedIn is true
    if (!endpoints.user) {
      auth.setState('loggedIn', true)
      return Promise.resolve()
    }

    // Token is required but not available
    if (tokenRequired && !auth.token) {
      return Promise.resolve()
    }

    // Try to fetch user and then set loggedIn to true
    return auth.request(endpoint, endpoints.user)
      .then(data => auth.setState('user', data))
      .then(() => auth.setState('loggedIn', true))
  },

  logout (auth, endpoint) {
    if (!endpoints.logout) {
      return Promise.resolve()
    }

    return auth.request(endpoint, endpoints.logout)
      .catch(() => auth.reset())
      .then(() => auth.reset())
  }
})
