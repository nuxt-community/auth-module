import jwt_decode from 'jwt-decode'
import uuid from 'uuid'

const parseQuery = queryString => {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

const encodeQuery = queryObject => {
  return Object.entries(queryObject)
    .filter(([key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

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

  get _scope() {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI() {
    const url = this.options.redirect_uri

    if (url) {
      return url
    }

    if (process.browser) {
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted() {
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

  _setToken(token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken() {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
  }

  async logout() {
    const ssl = this.options.ssl !== false
    const host = this.options.host || '127.0.0.1:8080'
    const realm = this.options.realm || 'master'
    const referrer = this.options.logout_referrer || 'default'
    const referrer_uri = this.options.logout_referrer_uri || 'localhost'
    const redirect_uri = this.options.logout_redirect || 'localhost'
    const protocol = ssl ? 'https' : 'http'

    await this.$auth.ctx.redirect(
      `${protocol}://${host}/auth/realms/${realm}/protocol/openid-connect/logout?` +
      encodeQuery({ referrer, referrer_uri, redirect_uri })
    )

    return this._clearToken()
  }

  login() {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
      state: this.options.state || uuid(),
      nonce: this.options.nonce || uuid()
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    this.$auth.$storage.setLocalStorage(this.name + '.state', opts.state)

    try {
      if (this.options.override_authorization_endpoint && process.browser) {
        //Replaces host component of URL
        this.options.authorization_endpoint = this.options.authorization_endpoint.replace(/:\/\/.+?:/, '://' + window.location.hostname + ':')
      }
    } catch (e) {
      console.error('Failed to override authorization_endpoint url: ' + e)
    }

    const url = this.options.authorization_endpoint + '?' + encodeQuery(opts)

    if (process.browser) {
      window.location = url
    }
  }

  async fetchUser() {
    const user = {}
    const token = this.$auth.getToken(this.name)
    const idToken = this.$auth.getToken(`${this.name}_id_token`)
    if (!token) {
      return
    }

    let decodedToken = {}
    let decodedIdToken = {}

    try {
      decodedToken = jwt_decode(token)

      if (!!idToken) {
        decodedIdToken = jwt_decode(idToken)
        console.log('TOKEN', decodedIdToken)
      }

      if (this.options.include_user_token_properties) {
        const tokenProps = {}
        const includeProperties = this.options.include_user_token_properties

        if (includeProperties.name && decodedIdToken.name) {
          let userPropertyName = 'name'
          if (typeof includeProperties.name === 'string') {
            userPropertyName = includeProperties.name
          }
          tokenProps[userPropertyName] = decodedIdToken.name
        }

        if (includeProperties.email && decodedIdToken.email) {
          let userPropertyName = 'email'
          if (typeof includeProperties.email === 'string') {
            userPropertyName = includeProperties.email
          }
          tokenProps[userPropertyName] = decodedIdToken.email
        }

        if (includeProperties.preferred_username && decodedIdToken.preferred_username) {
          let userPropertyName = 'preferred_username'
          if (typeof includeProperties.preferred_username === 'string') {
            userPropertyName = includeProperties.preferred_username
          }
          tokenProps[userPropertyName] = decodedIdToken.preferred_username
        }

        if (includeProperties.given_name && decodedIdToken.given_name) {
          let userPropertyName = 'given_name'
          if (typeof includeProperties.given_name === 'string') {
            userPropertyName = includeProperties.given_name
          }
          tokenProps[userPropertyName] = decodedIdToken.given_name
        }

        if (includeProperties.family_name && decodedIdToken.family_name) {
          let userPropertyName = 'family_name'
          if (typeof includeProperties.family_name === 'string') {
            userPropertyName = includeProperties.family_name
          }
          tokenProps[userPropertyName] = decodedIdToken.family_name
        }

        if (includeProperties.resource_access && decodedIdToken.resource_access) {
          let userPropertyName = 'resource_access'
          if (typeof includeProperties.resource_access === 'string') {
            userPropertyName = includeProperties.resource_access
          }
          tokenProps[userPropertyName] = decodedIdToken.resource_access
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

    //TODO:  Grab user from userinfo endpoint (take care of infinite redirect issue by updating host of userinfo url)
    this.$auth.setUser(user)
  }

  async _handleCallback(uri) {
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

    let idToken =
      parsedQuery[this.options.id_token_key || 'id_token']

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

      if (data.id_token) {
        idToken = data.id_token
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
    this.$auth.setToken(`${this.name}_id_token`, idToken)
    this.$auth.syncToken(`${this.name}_id_token`)

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
