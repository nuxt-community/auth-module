import authAPI from '../../demo/api/auth'
import authModuleDist from '../..'
import oidcMockServer from '../../demo/api/oidcmockserver'

export default ({ port = 3000 } = {}) => ({
  server: {
    port
  },
  serverMiddleware: [
    authAPI,
    { path: '/oidc', handler: oidcMockServer({ port }) }
  ],
  modules: ['@nuxtjs/axios', authModuleDist],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': `http://localhost:${port}`
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
        logoutRedirectUri: `http://localhost:${port}`,
        endpoints: {
          configuration: `http://localhost:${port}/oidc/.well-known/openid-configuration`
        }
      }
    }
  }
})
