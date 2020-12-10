import { assignDefaults, addAuthorize } from '../../utils/provider'

export default function discord(nuxt, strategy) {
  assignDefaults(strategy, {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://discord.com/api/oauth2/authorize',
      token: 'https://discord.com/api/oauth2/token',
      userInfo: 'https://discord.com/api/users/@me'
    },
    scope: ['identify', 'email']
  })

  addAuthorize(nuxt, strategy, true)
}
