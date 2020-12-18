import authAPI from '../../demo/api/auth'
import authModuleDist from '../..'

export default {
  serverMiddleware: [authAPI],
  modules: ['@nuxtjs/axios', authModuleDist],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  auth: {
    plugins: ['~/plugins/auth.js'],
    strategies: {
      local: {
        token: {
          property: 'token.accessToken'
        }
      },
      localRefresh: {
        scheme: 'refresh',
        token: {
          property: 'token.accessToken',
          maxAge: 15
        },
        refreshToken: {
          property: 'token.refreshToken',
          data: 'refreshToken',
          maxAge: false
        }
      },
      test: {
        provider: '~/auth/test-provider.js',
        scheme: '~/auth/test-scheme.js'
      }
    }
  }
}
