import { NuxtConfig } from '@nuxt/types'

export default <NuxtConfig>{
  build: {
    extractCSS: true
  },
  serverMiddleware: ['~/api/auth', '~/api/oauth2mockserver'],
  buildModules: ['@nuxt/typescript-build'],
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '../src/module'],
  components: true,
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000',
    '/laravel': {
      target: 'https://laravel-auth.nuxtjs.app',
      pathRewrite: { '^/laravel': '/' }
    }
  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/signed-out'
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
      auth0: {
        domain: 'nuxt-auth.auth0.com',
        clientId: 'q8lDHfBLJ-Fsziu7bf351OcYQAIe3UJv'
      },
      facebook: {
        endpoints: {
          userInfo:
            'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday'
        },
        clientId: '1671464192946675',
        scope: ['public_profile', 'email', 'user_birthday']
      },
      google: {
        clientId:
          '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com'
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      },
      // twitter: {
      //   clientId: 'FAJNuxjMTicff6ciDKLiZ4t0D'
      // },
      laravelJWT: {
        url: '/laravel',
        endpoints: {
          login: {
            url: '/api/auth/jwt/login'
          },
          refresh: {
            url: '/api/auth/jwt/refresh'
          },
          logout: {
            url: '/api/auth/jwt/logout'
          },
          user: {
            url: '/api/auth/jwt/user'
          }
        }
      },
      laravelSanctum: {
        url: '/laravel'
      },
      laravelPassport: {
        url: 'https://laravel-auth.nuxtjs.app',
        endpoints: {
          userInfo: '/api/auth/passport/user'
        },
        token: {
          maxAge: 1800
        },
        refreshToken: {
          maxAge: 60 * 60 * 24 * 30
        },
        clientId: '3',
        clientSecret: 'k0NAhYGKXbG6NjENFz4VIe5YSbccZWW9V3gGeSOa'
      },
      laravelPassportPasswordGrant: {
        name: 'laravelPassportPassword',
        provider: 'laravelPassport',
        url: '/laravel',
        endpoints: {
          user: {
            url: '/api/auth/passport/user'
          }
        },
        token: {
          maxAge: 1800
        },
        refreshToken: {
          maxAge: 60 * 60 * 24 * 30
        },
        clientId: '2',
        clientSecret: 'eKm1ei8muaql7TfcBxhN6Nq48oSflw6QJKCZF8gl',
        grantType: 'password'
      },
      oauth2mock: {
        scheme: 'oauth2',
        endpoints: {
          authorization: '/oauth2mockLogin',
          token: '/oauth2mockserver/token',
          userInfo: '/oauth2mockserver/userinfo'
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: 'test-client'
      }
    }
  }
}
