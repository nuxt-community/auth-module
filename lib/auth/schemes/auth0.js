import { WebAuth } from 'auth0-js'

export default class Auth0Scheme {
  constructor (auth, options) {
    this.auth = auth

    // -- Assign defaults and normalize options --
    this.options = Object.assign({
      responseType: 'token id_token',
      scope: 'openid profile email'
    }, options)

    if (!this.options.audience) {
      this.options.audience = 'https://' + this.options.domain + '/userinfo'
    }

    // Create new auth0 instance
    this.auth0 = new WebAuth(this.options)
  }

  mounted () {
    // Sync token
    this.auth.syncToken()

    // Handle callbacks on page load
    this._handleCallback()
  }

  login (options) {
    this.auth0.authorize(Object.assign({
      redirectUri: window.location.href.split('#')[0]
    }, this.options, options))

    return Promise.resolve()
  }

  fetchUser () {
    if (!this.auth.token) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(this.auth.token, (err, user) => {
        if (err) {
          return reject(err)
        }

        // Now you have the user's information
        this.auth.setUser(user)
        resolve()
      })
    })
  }

  _handleCallback () {
    // Callback flow is not supported in server side
    if (process.server) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          return reject(err)
        }

        if (!authResult) {
          return Promise.resolve()
        }

        // Update token
        this.auth.setToken(authResult.accessToken)

        // Try directly parsing idToken
        if (typeof authResult.idToken === 'string') {
          try {
            const user = JSON.parse(atob(authResult.idToken.split('.')[1]))
            this.auth.setUser(user)
            return Promise.resolve()
          } catch (e) {
            // ...
          }
        }

        return this.fetchUser()
      })
    })
  }
}
