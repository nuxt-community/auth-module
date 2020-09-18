const util = require('util')
const exec = util.promisify(require('child_process').exec)
const {
  setup: setupDevServer,
  teardown: teardownDevServer
} = require('jest-dev-server')

const browserTimeout = 25 * 1000
const port = 3000
const url = p => 'http://localhost:' + port + p

const MODES_TO_TEST = { UNIVERSAL: 'UNIVERSAL', SPA: 'SPA' }

const nuxtCommand = (type, { configFilePath, spa } = { spa: false }) =>
  [
    'yarn nuxt',
    type,
    'test/fixture',
    ...(configFilePath ? [`-c ${configFilePath}`] : []),
    ...(spa ? ['--spa'] : [])
  ].join(' ')

const setup = async (options) => {
  await exec(nuxtCommand('build', options))
  await setupDevServer({
    command: nuxtCommand('start', options),
    port: 3000,
    launchTimeout: browserTimeout
  })
}

const getAuthDataFromWindow = () =>
  page.evaluate(async () => {
    return {
      axiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
      token: window.$nuxt.$auth.strategy.token.get(),
      expiresAt: window.$nuxt.$auth.strategy.token._getExpiration(),
      idToken: window.$nuxt.$auth.strategy.idToken.get(),
      refreshToken: window.$nuxt.$auth.strategy.refreshToken.get(),
      user: window.$nuxt.$auth.user
    }
  })

const loginWithOidc = async () => {
  await page.waitForFunction('!!window.$nuxt')
  await page.evaluate(async () => {
    await window.$nuxt.$auth.loginWith('oidcAuthorizationCode')
  })

  //  Login
  await page.waitForNavigation()
  expect(page.url()).toContain('/oidc/interaction')

  await page.type('[name="login"]', 'test_username')
  await page.type('[name="password"]', 'test')
  await page.click('[type="submit"]')

  //  Consent
  const consentHtml = await page.$eval('.login-card', card => card.innerHTML)
  expect(consentHtml).toContain('scopes')
  expect(consentHtml).toContain('profile')
  await page.click('[type="submit"]')

  // Callback
  expect(page.url()).toContain(`http://localhost:${port}/login`)

  // Redirect to home
  await page.waitForFunction('!!window.$nuxt')
  expect(page.url()).toContain(`http://localhost:${port}`)
}

const logoutWithOidc = async () => {
  await page.evaluate(async () => {
    await window.$nuxt.$auth.logout()
  })

  await page.waitForNavigation()
  expect(page.url()).toContain('/oidc/connect/endsession')

  await page.click('[value="yes"][name="logout"]')

  await page.waitForFunction('!!window.$nuxt')
  expect(page.url()).toContain(`http://localhost:${port}`)
}

describe('OpenID Connect', () => {
  describe.each(Object.keys(MODES_TO_TEST))('%s', (mode) => {
    describe('Default fixture', () => {
      beforeAll(async () => {
        await setup({ spa: mode === MODES_TO_TEST.SPA })
      }, browserTimeout)

      beforeEach(async () => {
        await jestPuppeteer.resetBrowser()
      })

      afterAll(async () => {
        await teardownDevServer()
      })

      test('initial state', async () => {
        await page.goto(url('/'))
        const state = await page.evaluate(() => window.__NUXT__?.state)

        if (mode === MODES_TO_TEST.SPA) {
          expect(state).toBeUndefined()
        } else {
          expect(state.auth).toEqual({
            user: null,
            loggedIn: false,
            strategy: 'local'
          })
        }
      })

      describe('Authorization Code Flow', () => {
        test('login', async () => {
          await page.goto(url('/'))
          await loginWithOidc()

          const {
            token,
            user,
            axiosBearer,
            idToken,
            refreshToken
          } = await getAuthDataFromWindow()

          expect(axiosBearer).toBeDefined()
          expect(axiosBearer.split(' ')).toHaveLength(2)
          expect(axiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
          expect(token).toBeDefined()
          expect(idToken).toBeDefined()
          expect(refreshToken).toBeDefined()
          expect(user).toBeDefined()
          expect(user.sub).toBe('test_username')
        })

        test('refresh', async () => {
          await page.goto(url('/'))
          await loginWithOidc()

          const {
            token: loginToken,
            idToken: loginIdToken,
            refreshToken: loginRefreshToken,
            expiresAt: loginExpiresAt,
            user: loginUser,
            axiosBearer: loginAxiosBearer
          } = await getAuthDataFromWindow()

          expect(loginAxiosBearer).toBeDefined()
          expect(loginAxiosBearer.split(' ')).toHaveLength(2)
          expect(loginAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
          expect(loginToken).toBeDefined()
          expect(loginIdToken).toBeDefined()
          expect(loginRefreshToken).toBeDefined()
          expect(loginExpiresAt).toBeDefined()
          expect(loginUser).toBeDefined()
          expect(loginUser.sub).toBe('test_username')

          await page.evaluate(async () => {
            await window.$nuxt.$auth.refreshTokens()
          })

          const {
            token: refreshedToken,
            idToken: refreshedIdToken,
            refreshToken: refreshedRefreshToken,
            expiresAt: refreshedExpiresAt,
            axiosBearer: refreshedAxiosBearer,
            user: refreshedUser
          } = await getAuthDataFromWindow()

          expect(refreshedAxiosBearer).toBeDefined()
          expect(refreshedAxiosBearer.split(' ')).toHaveLength(2)
          expect(refreshedAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
          expect(refreshedAxiosBearer).not.toEqual(loginAxiosBearer)
          expect(refreshedToken).toBeDefined()
          expect(refreshedToken).not.toEqual(loginToken)
          expect(refreshedIdToken).toBeDefined()
          expect(refreshedIdToken).not.toEqual(loginIdToken)
          expect(refreshedRefreshToken).toBeDefined()
          expect(refreshedRefreshToken).not.toEqual(loginRefreshToken)
          expect(refreshedExpiresAt).toBeDefined()
          expect(refreshedExpiresAt).toBeGreaterThanOrEqual(loginExpiresAt)
          expect(refreshedUser).toBeDefined()
          expect(refreshedUser.sub).toBe('test_username')
        })

        test('logout', async () => {
          await page.goto(url('/'))
          await loginWithOidc()

          const {
            token: loginToken,
            axiosBearer: loginAxiosBearer
          } = await getAuthDataFromWindow()

          expect(loginAxiosBearer).toBeDefined()
          expect(loginToken).toBeDefined()

          await logoutWithOidc()

          const {
            token: logoutToken,
            axiosBearer: logoutAxiosBearer
          } = await getAuthDataFromWindow()

          expect(logoutToken).toBeFalsy()
          expect(logoutAxiosBearer).toBeUndefined()
        })
      })
    })

    describe('Custom fixture', () => {
      beforeAll(async () => {
        await setup({ spa: mode === MODES_TO_TEST.SPA, configFilePath: 'nuxt.config.custom.js' })
      }, browserTimeout)

      beforeEach(async () => {
        await jestPuppeteer.resetBrowser()
      })

      afterAll(async () => {
        await teardownDevServer()
      })

      test("Default auth endpoints won't be overwritten by discovery document", async () => {
        await page.goto(url('/'))
        await page.waitForFunction('!!window.$nuxt')
        await page.evaluate(
          async () =>
            await window.$nuxt.$auth.setStrategy('oidcAuthorizationCode')
        )
        await page.waitFor(1000)
        const activeStrategy = await page.evaluate(async () => ({
          name: window.$nuxt.$auth.strategy.name,
          userInfoEndpoint:
              window.$nuxt.$auth.strategy.options.endpoints.userInfo,
          logoutRedirectUri: window.$nuxt.$auth.strategy.options.logoutRedirectUri
        }))
        expect(activeStrategy.name).toEqual('oidcAuthorizationCode')
        expect(activeStrategy.logoutRedirectUri).toEqual('http://localhost:4000')
        expect(activeStrategy.userInfoEndpoint).toEqual('/something/random')
      })
    })
  })
})
