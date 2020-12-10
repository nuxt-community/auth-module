import authAPI from '../../demo/api/auth'
import authModuleDist from '../..'
import oidcMockServer from '../../demo/api/oidcmockserver'

export default {
  serverMiddleware: [
    authAPI,
    { path: '/oidc', handler: (req, res) => oidcMockServer(req, res, 3000) }
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
      oidcAuthorizationCode: {
        scheme: 'openIDConnect',
        responseType: 'code',
        scope: ['openid', 'profile', 'offline_access'],
        grantType: 'authorization_code',
        clientId: 'oidc_authorization_code_client',
        logoutRedirectUri: 'http://localhost:3000',
        endpoints: {
          configuration: 'http://localhost:3000/oidc/.well-known/openid-configuration'
        }
      }
    }
  }
}
