import { assignDefaults, addAuthorize, assignAbsoluteEndpoints } from './_utils'

export function laravelPassport (nuxt, strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required is laravel passport!')
  }

  assignDefaults(strategy, {
    scheme: 'oauth2',
    endpoints: {
      authorization: url + '/oauth/authorize',
      token: url + '/oauth/token'
    },
    token: {
      property: 'access_token',
      type: 'Bearer',
      name: 'Authorization',
      maxAge: 60 * 60 * 24 * 365
    },
    refreshToken: {
      property: 'refresh_token',
      maxAge: 60 * 60 * 24 * 30
    },
    responseType: 'code',
    grantType: 'authorization_code',
    scope: '*'
  })

  assignAbsoluteEndpoints(nuxt, strategy)
  addAuthorize(nuxt, strategy)
}
