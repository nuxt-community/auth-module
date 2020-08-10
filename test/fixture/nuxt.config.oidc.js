import authModuleDist from '../..'
import oidcmockserver from '../../demo/api/oidcmockserver'

export default {
  serverMiddleware: [
    { path: '/oidc', handler: (req, res) => oidcmockserver(req, res, 3000) }
  ],
  modules: ['@nuxtjs/axios', authModuleDist],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000'
  },
  auth: {
    plugins: ['~/plugins/auth.js'],
    redirect: {
      callback: '/callback'
    },
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
      },
      oidcmock: {
        scheme: 'oidc',
        baseURL: 'http://localhost:3000/oidc',
        responseType: 'code',
        scope: ['openid', 'profile', 'offline_access'],
        grantType: 'authorization_code',
        clientId: 'nuxt_auth_oidc_client',
        logoutRedirectUri: 'http://localhost:3000'
      }
    }
  }
}
