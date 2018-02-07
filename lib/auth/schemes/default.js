export default options => ({
  async login (auth, endpoint) {
    const data = await auth.request(endpoint, options.endpoints.login)

    // Extract and set token
    auth.setToken(data)

    // Fetch User
    if (options.fetchUserOnLogin && options.endpoints.user) {
      return auth.fetchUser()
    }

    // Set loggedIn to true
    auth.setState('loggedIn', true)
  },

  async fetchUser (auth, endpoint) {
    if (options.token && !auth.getState('_token')) {
      return
    }

    const data = await auth.request(endpoint, options.endpoints.user)

    auth.setState('user', data)
    auth.setState('loggedIn', true)
  },

  async logout (auth, endpoint) {
    await auth.request(endpoint, options.endpoints.user.logout)

    auth.reset()
  }
})
