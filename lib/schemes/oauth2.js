import { encodeQuery, parseQuery, randomString } from '../utilities'

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token',
  tokenName: 'Authorization',
  autoLogin: false,
  tokenParams: false,
  authHeader: false
}

export default class Oauth2Scheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
  }

  get _scope () {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI () {
    const url = this.options.redirect_uri

    if (url) {
      return url
    }

    // Generate redirect url if none provided
    if (!url) {
      let baseUrl

      // Browser was here before, but client is documented, so I'm using client
      if (process.client || process.browser) {
        baseUrl = window.location.origin
      } else if (process.server) {
        // Attempt to grab baseUrl from axios if it exists
        if (this.$auth.ctx.$axios && this.$auth.ctx.$axios.defaults && this.$auth.ctx.$axios.defaults.baseURL) {
          baseUrl = this.$auth.ctx.$axios.defaults.baseURL
        } else {
          // Generate url from options or request
          let protocol = this.options.protocol || this.$auth.options.redirect.protocol || 'https'
          let host = this.options.host || this.$auth.options.redirect.host || this.$auth.ctx.req.headers.host
          baseUrl = protocol + '://' + host
        }
      }

      // Remove trailing slashes
      baseUrl = baseUrl.replace(/^\/|\/$/g, '')

      return baseUrl + this.$auth.options.redirect.callback
    }
  }

  async mounted () {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    const refreshToken = this.$auth.syncRefreshToken(this.name)
    const expiresAt = this.$auth.syncExpiresAt(this.name)
    // Set axios token
    if (token) {
      this._setToken(token)

      if (refreshToken && expiresAt) {
        this._scheduleTokenRefresh(refreshToken, expiresAt)
      }
    }
    // Handle callbacks on page load
    const redirected = await this._handleCallback()
    if (!redirected) {
      if (!token && this.options.autoLogin) {
        let path = this.options.autoLogin === true ? (this.$auth.options.redirect.callback + '/' + this.name) : this.options.autoLogin
        if (process.client || process.browser) {
          if (location.pathname === path && location.search.length === 0) {
            return this.login()
          }
        } else if (process.server) {
          let route = this.$auth.ctx.route
          if (route.path === path && Object.keys(route.query).length === 0) {
            return this.login()
          }
        }
      }
      return this.$auth.fetchUserOnce()
    }
  }

  // Handle resetting properly
  reset () {
    this._clearToken()
    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)
    this.$auth.setExpiresAt(this.name, false)
  }

  _setToken (token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken () {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
  }

  _scheduleTokenRefresh (refreshToken, expiresAt) {
    if (this.refreshTimeout) {
      return
    }

    if (~refreshToken.indexOf(' ')) {
      refreshToken = refreshToken.split(' ')[1]
    }

    let time = expiresAt - Date.now()
    if (time < 1000) time = 1000

    this.$auth.setExpiresAt(this.name, expiresAt)
    this.refreshTimeout = setTimeout(() => {
      this.refreshTimeout = 0
      return this._fetchToken({ refreshToken })
    }, time)
  }

  async _fetchToken (options = {}) {
    let token, refreshToken, expiresIn

    if (options.code || options.refreshToken) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: false,
        data: {
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          grant_type: options.refreshToken ? 'refresh_token' : this.options.grant_type,
          code: options.code,
          refresh_token: options.refreshToken
        }
      })

      if (data.access_token) {
        token = data.access_token
      }

      if (data.refresh_token) {
        refreshToken = data.refresh_token
        expiresIn = data.expires_in
      }
    }

    // Append token_type
    if (this.options.token_type) {
      token = this.options.token_type + ' ' + token
    }

    // Store token
    this.$auth.setToken(this.name, token)

    // Set axios token
    this._setToken(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
      this._scheduleTokenRefresh(refreshToken, Date.now() + (expiresIn * 950)) // 95% of expiration time
    }

    return {
      token,
      refreshToken
    }
  }

  async logout () {
    this._clearToken()
    return this.$auth.reset()
  }

  login () {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      state: randomString()
    }

    this.$auth.$storage.setLocalStorage(this.name + '.state', opts.state)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    if (process.client || process.browser) {
      window.location = url
    } else if (process.server) {
      this.$auth.ctx.redirect(url)
    }
  }

  async fetchUser () {
    if (!this.$auth.getToken(this.name)) {
      return
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({})
      return
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })

    this.$auth.setUser(user)
  }

  async _handleCallback () {
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    // Parse query from both search and hash fragments
    const hash = parseQuery(window.location.hash.substr(1))
    const search = parseQuery(window.location.search.substr(1))
    const parsedQuery = Object.assign({}, search, hash)

    // accessToken/idToken
    let token = parsedQuery[this.options.token_key || 'access_token']

    // refresh token
    let refreshToken = parsedQuery[this.options.refresh_token_key || 'refresh_token']

    // -- Authorization Code Grant --
    if (this.options.response_type !== 'code' || !parsedQuery.code) {
      return
    }
    
    // Fetch token
    await this._fetchToken({ code: parsedQuery.code, token, refreshToken })

    // Validate state
    const state = this.$auth.$storage.getLocalStorage(this.name + '.state')
    this.$auth.$storage.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
