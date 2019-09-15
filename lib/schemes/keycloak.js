import jwt_decode from 'jwt-decode'
import { encodeQuery, parseQuery, randomString } from '../utilities'

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token',
  tokenName: 'Authorization'
}

export default class KeycloakScheme {
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

    if (process.browser) {
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted () {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    // Set axios token
    if (token) {
      this._setToken(token)
    }

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  _setToken (token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken () {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
  }

  async logout () {
    const ssl = this.options.ssl !== false
    const host = this.options.host || '127.0.0.1:8180'
    const realm = this.options.realm || 'master'
    const referrer = this.options.logout_referrer || 'my-app'
    const referrer_uri = this.options.logout_referrer_uri || 'localhost'
    const redirect_uri = this.options.logout_redirect || 'localhost'
    const protocol = ssl ? 'https' : 'http'

    await this.$auth.ctx.redirect(
      `${protocol}://${host}/auth/realms/${realm}/protocol/openid-connect/logout?` +
        encodeQuery({ referrer, referrer_uri, redirect_uri })
    )

    return this._clearToken()
  }

  login () {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
      state: this.options.state || randomString(),
      nonce: this.options.nonce || randomString()
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    this.$auth.$storage.setLocalStorage(this.name + '.state', opts.state)

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    if (process.browser) {
      window.location = url
    }
  }

  async fetchUser () {
    const user = {}
    const token = this.$auth.getToken(this.name)
    if (!token) {
      return
    }

    let decodedToken = {}
    try {
      decodedToken = jwt_decode(token)

      if (this.options.include_user_token_properties) {
        const tokenProps = {}
        const includeProperties = this.options.include_user_token_properties

        if (includeProperties.resource_access && decodedToken.resource_access) {
          let userPropertyName = 'resource_access'
          if (typeof includeProperties.resource_access === 'string') {
            userPropertyName = includeProperties.resource_access
          }
          tokenProps[userPropertyName] = decodedToken.resource_access
        }

        if (includeProperties.realm_access && decodedToken.realm_access) {
          let userPropertyName = 'realm_access'
          if (typeof includeProperties.realm_access === 'string') {
            userPropertyName = includeProperties.realm_access
          }
          tokenProps[userPropertyName] = decodedToken.realm_access
        }

        if (includeProperties.exp && decodedToken.exp) {
          let userPropertyName = 'exp'
          if (typeof includeProperties.resource_access === 'string') {
            userPropertyName = includeProperties.exp
          }
          tokenProps[userPropertyName] = decodedToken.exp
        }

        if (includeProperties.aud && decodedToken.aud) {
          let userPropertyName = 'aud'
          if (typeof includeProperties.aud === 'string') {
            userPropertyName = includeProperties.aud
          }
          console.log('adding prop')
          tokenProps[userPropertyName] = decodedToken.aud
        }

        if (
          includeProperties.allowed_origins &&
          decodedToken['allowed-origins']
        ) {
          let userPropertyName = 'allowed_origins'
          if (typeof includeProperties.allowed_origins === 'string') {
            userPropertyName = includeProperties.allowed_origins
          }
          tokenProps[userPropertyName] = decodedToken['allowed-origins']
        }

        Object.assign(user, tokenProps)
      }
    } catch (err) {
      console.log('Problem decoding token')
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser(user)
      return
    }

    const fetchedUser = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })
    this.$auth.setUser(Object.assign(user, fetchedUser))
  }

  async _handleCallback (uri) {
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
    let refreshToken =
      parsedQuery[this.options.refresh_token_key || 'refresh_token']

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: false,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          audience: this.options.audience,
          grant_type: this.options.grant_type
        })
      })

      if (data.access_token) {
        token = data.access_token
      }

      if (data.refresh_token) {
        refreshToken = data.refresh_token
      }
    }

    if (!token || !token.length) {
      return
    }

    // Validate state
    const state = this.$auth.$storage.getLocalStorage(this.name + '.state')
    this.$auth.$storage.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
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
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
