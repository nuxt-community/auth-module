import defu from 'defu'
import defaultFixtureConfig from './nuxt.config'

export default (...args) =>
  defu(
    {
      auth: {
        strategies: {
          oidcAuthorizationCode: {
            logoutRedirectUri: 'http://localhost:4000',
            endpoints: {
              userInfo: '/something/random'
            }
          }
        }
      }
    },
    defaultFixtureConfig(...args)
  )
