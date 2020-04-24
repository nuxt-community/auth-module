import { assignDefaults, addAuthorize, initializePasswordGrantFlow, assignAbsoluteEndpoints } from './_utils'

module.exports = function laravelPassport (nuxt, strategy) {
  const { url, grantType } = strategy
  const isPasswordGrant = grantType === 'password'

  if (!url) {
    throw new Error('url is required is laravel passport!')
  }

  const defaults = {
    _name: 'laravel.passport',
    token: {
      property: 'access_token',
      type: 'Bearer',
      name: 'Authorization',
      maxAge: 60 * 60 * 24 * 365
    },
    refreshToken: {
      property: 'refresh_token',
      data: 'refresh_token',
      maxAge: 60 * 60 * 24 * 30
    },
    user: {
      property: false
    }
  }

  if (isPasswordGrant) {
    assignDefaults(strategy, {
      ...defaults,
      _scheme: 'refresh',
      endpoints: {
        token: url + '/oauth/token',
        login: {},
        refresh: {},
        logout: {
          url: url + '/api/auth/logout'
        },
        user: {
          url: url + '/api/auth/user'
        }
      },
      grantType: 'password'
    })

    initializePasswordGrantFlow(nuxt, strategy)
  } else {
    assignDefaults(strategy, {
      ...defaults,
      _scheme: 'oauth2',
      endpoints: {
        authorization: url + '/oauth/authorize',
        token: url + '/oauth/token',
        userInfo: url + '/api/auth/user',
        logout: url + '/api/auth/logout'
      },
      responseType: 'code',
      grantType: 'authorization_code',
      scope: '*'
    })

    addAuthorize(nuxt, strategy)
  }

  assignAbsoluteEndpoints(strategy)
}
