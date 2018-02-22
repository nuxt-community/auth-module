import { WebAuth } from 'auth0-js'

const DEFAULTS = {
  responseType: 'token id_token',
  scope: 'openid profile email'
}

export default class Auth0Scheme {
  constructor (auth, options) {
    this.auth = auth
    this.name = options._name

    // -- Assign defaults and normalize options --
    this.options = Object.assign({}, DEFAULTS, options)

    if (!this.options.audience) {
      this.options.audience = 'https://' + this.options.domain + '/userinfo'
    }

    // Create new auth0 instance
    this.auth0 = new WebAuth(this.options)
  }

  mounted () {
    // Sync token
    this.auth.syncToken(this.name)

    // Handle callbacks on page load
    this._handleCallback()
  }

  login (options) {
    this.auth0.authorize(
      Object.assign(
        {
          redirectUri: window.location.href.split('#')[0]
        },
        this.options,
        options
      )
    )
  }

  fetchUser () {
    const token = this.auth.getToken(this.name)

    if (!token) {
      return
    }

    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(token, (err, user) => {
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
      return
    }

    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.error(err) // eslint-disable-line no-console
          return resolve()
        }

        if (!authResult) {
          return resolve()
        }

        // Update token
        this.auth.setToken(this.name, authResult.accessToken)

        // Fetch user
        return this.fetchUser()
      })
    })
  }
}
