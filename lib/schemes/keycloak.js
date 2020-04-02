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

export default class KeycloakScheme {
  constructor (auth, userOptions) {
    this.$auth = auth
    this.name = userOptions._name

    if (!this.$auth.$storage.getCookie()) {
      this.$auth.$storage.removeLocalStorage()
    }

    let nuxt_host = userOptions.nuxt_host || '127.0.0.1'
    let nuxt_port = userOptions.nuxt_port ? `:${userOptions.nuxt_port}` : ''
    let keycloak_host = userOptions.keycloak_host || '127.0.0.1'
    let keycloak_port = userOptions.keycloak_port ? `:${userOptions.keycloak_port}` : ':8080'
    let ssl = userOptions.hasOwnProperty('ssl') ? userOptions.ssl : true
    let protocol = userOptions.protocol || ssl ? 'https' : 'http'

    let client_id = userOptions.client_id || 'nuxt-app'
    let realm = userOptions.realm || 'master'
    let base_uri = userOptions.base_uri || `${protocol}://${keycloak_host}${keycloak_port}/auth/realms/${realm}/protocol/openid-connect`

    let audience = userOptions.audience || 'nuxt-app'
    let grant_type = userOptions.grant_type || 'implicit'
    let authorization_uri = `${base_uri}/auth`
    let userinfo_uri = userOptions.userinfo_uri || `${base_uri}/userinfo`
    let account_uri = userOptions.account_uri || `${protocol}://${keycloak_host}${keycloak_port}/auth/realms/${realm}/account`
    let cert_uri = userOptions.cert_uri || `${base_uri}/certs`

    let referrer = userOptions.referrer || 'Web App'
    let referrer_uri = userOptions.referrer_uri || `${protocol}://${nuxt_host}${nuxt_port}`
    let redirect_uri = userOptions.redirect_uri || `${protocol}://${nuxt_host}${nuxt_port}`

    let logout_redirect_uri = `${protocol}://${keycloak_host}/login`
    let logout_referrer = userOptions.logout_referrer || 'Web App'
    let logout_referrer_uri = userOptions.logout_referrer_uri || `${protocol}://${nuxt_host}${nuxt_port}`
    let logout_uri = `${base_uri}/logout?` + encodeQuery({ referrer: logout_referrer, referrer_uri: logout_referrer_uri, redirect_uri: logout_redirect_uri })

    let token_name = userOptions.token_name || 'Authorization'
    let token_type = userOptions.token_type || 'Bearer'
    let token_key = userOptions.token_key || 'access_token'
    let access_token_uri = userOptions.access_token_uri || `${base_uri}/token`
    let response_type = userOptions.response_type || 'id_token token'

    // We need to detect if userOptions has a value for use_browser_host but if it is coerced (!value)
    // we don't know if it has a value which is false or no value at all since they are both truthy and would be false.
    // Therefore we need to first coerce it and then also check that its strict value is not false so that we respect
    // the users option of whether or not to use the browsers address bar for subsequent requests
    let use_browser_host = (!userOptions.use_browser_host && userOptions.use_browser_host !== false) || userOptions.use_browser_host ? userOptions.use_browser_host : true;

    // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
    // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
    // @ts-ignore
    let state = userOptions.state || uuid()
    // @ts-ignore
    let nonce = userOptions.nonce || uuid()

    const options = Object.assign({}, userOptions, {
      nuxt_host,
      nuxt_port,
      account_uri,
      keycloak_host,
      keycloak_port,
      ssl,
      protocol,
      client_id,
      realm,
      base_uri,
      audience,
      grant_type,
      authorization_uri,
      userinfo_uri,
      cert_uri,
      referrer,
      referrer_uri,
      redirect_uri,
      logout_uri,
      logout_redirect_uri,
      logout_referrer,
      logout_referrer_uri,
      token_name,
      token_type,
      token_key,
      access_token_uri,
      response_type,
      use_browser_host,
      state,
      nonce
    });

    this.options = options

    if (process.browser && options.use_browser_host) {
      this.updateOptionsForBrowserHostname()
    }
  }

  get _scope() {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI() {
    const url = this.$auth.$storage.getUniversal('redirect_uri')

    if (url) {
      return url
    }

    if (process.browser) {
      if (this.options.use_browser_host) {
        this.updateOptionsForBrowserHostname()
      }
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted() {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    this.$auth.syncToken(`${this.name}_id_token`)
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
    this.$auth.ctx.app.$axios.setHeader(this.options.token_name, token)
  }

  _clearToken() {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.token_name, false)
  }

  async reset() {
    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setToken(`${this.name}_id_token`, false)
    this._clearToken()
    const web_app_uri = `${this.options.protocol}://${this.options.nuxt_host}${this.options.nuxt_port ? `:${this.options.nuxt_port}` : ''}`
    return this.$auth.ctx.redirect(web_app_uri)
  }

  async logout() {
    return this.$auth.ctx.redirect(this.options.logout_uri)
  }

  login() {
    if (process.browser && this.options.use_browser_host) {      
        this.updateOptionsForBrowserHostname()      
    }
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
      state: this.options.state,
      nonce: this.options.nonce
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    this.$auth.$storage.setLocalStorage(this.name + '.state', opts.state)

    if (process.browser) {      
      const url = this.options.authorization_uri + '?' + encodeQuery(opts)
      window.location = url
    }
  }

  updateOptionsForBrowserHostname() {
    if (window && window.location && window.location.hostname) {
      const protocol = this.options.protocol
      const browserProtocol = window.location.protocol.replace(":", "")
      const isProxied = browserProtocol === "https"
      const keycloak_port = isProxied ? ":8181" : this.options.keycloak_port
      const realm = this.options.realm
      const nuxt_host = window.location.hostname
      const nuxt_port = isProxied ? "" : this.options.nuxt_port
      const logout_referrer = this.options.logout_referrer
      const client_id = this.options.client_id

      const keycloak_host = `${window.location.hostname}`
      const base_uri = `${browserProtocol}://${keycloak_host}${keycloak_port}/auth/realms/${realm}/protocol/openid-connect`
      const account_uri = `${browserProtocol}://${keycloak_host}${keycloak_port}/auth/realms/${realm}/account`
      const authorization_uri = `${base_uri}/auth`
      const userinfo_uri = `${base_uri}/userinfo`
      const cert_uri = `${base_uri}/certs`
      const referrer_uri = `${browserProtocol}://${window.location.hostname}${nuxt_port}`
      const redirect_uri = `${browserProtocol}://${window.location.hostname}${nuxt_port}`
      const logout_redirect_uri = `${browserProtocol}://${window.location.hostname}${nuxt_port}/logout`
      const logout_referrer_uri = `${browserProtocol}://${window.location.hostname}${nuxt_port}`
      const logout_uri = `${base_uri}/logout?` + encodeQuery({ referrer: logout_referrer, referrer_uri: logout_referrer_uri, redirect_uri: logout_redirect_uri })
      const access_token_uri = `${base_uri}/token`

      this.options = Object.assign({}, this.options, {
        nuxt_host,
        nuxt_port,
        account_uri,
        keycloak_host,
        keycloak_port,
        protocol,
        client_id,
        realm,
        base_uri,
        authorization_uri,
        userinfo_uri,
        cert_uri,
        referrer_uri,
        redirect_uri,
        logout_uri,
        logout_redirect_uri,
        logout_referrer,
        logout_referrer_uri,
        access_token_uri
      });

      this.$auth.$storage.setCookie('app_host_uri', `${protocol}://${nuxt_host}${nuxt_port}/`)
      this.$auth.$storage.setCookie('base_uri', base_uri)
      this.$auth.$storage.setCookie('account_uri', account_uri)
      this.$auth.$storage.setCookie('client_id', client_id)
      this.$auth.$storage.setCookie('authorization_uri', authorization_uri)
      this.$auth.$storage.setCookie('redirect_uri', redirect_uri)
      this.$auth.$storage.setLocalStorage('app_host_uri', `${protocol}://${nuxt_host}${nuxt_port}/`)
      this.$auth.$storage.setLocalStorage('base_uri', base_uri)
      this.$auth.$storage.setLocalStorage('account_uri', account_uri)
      this.$auth.$storage.setLocalStorage('client_id', client_id)
      this.$auth.$storage.setLocalStorage('authorization_uri', authorization_uri)
      this.$auth.$storage.setLocalStorage('redirect_uri', redirect_uri)
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
      }

      if (this.options.include_user_token_properties) {
        const tokenProps = {}
        const includeProperties = this.options.include_user_token_properties || {}

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
        url: this.options.access_token_uri,
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
