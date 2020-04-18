import { assignDefaults, addAuthorize } from '../utils'

export function github (nuxt, strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    endpoints: {
      authorization: 'https://github.com/login/oauth/authorize',
      token: 'https://github.com/login/oauth/access_token',
      userInfo: 'https://api.github.com/user'
    },
    scope: ['user', 'email']
  })

  addAuthorize(nuxt, strategy)
}
