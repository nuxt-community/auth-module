import { setupTest, createPage } from '@nuxt/test-utils'
import { Page } from 'playwright'
import { OpenIDConnectScheme } from '../src/schemes/openIDConnect'

const port = 3000

const MODES_TO_TEST = { UNIVERSAL: 'universal', SPA: 'spa' }

type Mode = 'universal' | 'spa'

const getAuthDataFromWindow = (page: Page) =>
  page.evaluate(() => {
    const strategy = (window.$nuxt.$auth
      .strategy as unknown) as OpenIDConnectScheme
    return {
      axiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
      token: strategy.token.get(),
      idToken: strategy.idToken.get(),
      refreshToken: strategy.refreshToken.get(),
      user: window.$nuxt.$auth.user
    }
  })

const loginWithOidc = async (page: Page) => {
  await page.waitForFunction('!!window.$nuxt')
  await page.evaluate(async () => {
    await window.$nuxt.$auth.loginWith('oidcAuthorizationCode')
  })

  //  Login
  await page.waitForSelector('[name="login"]')
  expect(page.url()).toContain('/oidc/interaction')
  await page.type('[name="login"]', 'test_username')
  await page.type('[name="password"]', 'test')
  await page.click('[type="submit"]')

  //  Consent
  await page.waitForSelector('.login-card')
  const consentHtml = await page.$eval('.login-card', (card) => card.innerHTML)
  expect(consentHtml).toContain('scopes')
  expect(consentHtml).toContain('profile')
  await page.click('[type="submit"]')

  // Callback
  await page.waitForNavigation()
  expect(page.url()).toContain(`http://localhost:${port}/login`)

  // Redirect to home
  await page.waitForFunction('!!window.$nuxt')
  expect(page.url()).toContain(`http://localhost:${port}`)
}

const logoutWithOidc = async (page: Page) => {
  await page.evaluate(async () => {
    await window.$nuxt.$auth.logout()
  })

  expect(page.url()).toContain('/oidc/connect/endsession')

  await page.click('[value="yes"][name="logout"]')

  await page.waitForFunction('!!window.$nuxt')
  expect(page.url()).toContain(`http://localhost:${port}`)
}

describe('OpenID Connect', () => {
  describe.each(Object.values(MODES_TO_TEST))('%s', (mode: Mode) => {
    describe('Default fixture', () => {
      setupTest({
        browser: true,
        config: {
          mode,
          server: {
            port
          }
        }
      })

      test('initial state', async () => {
        const page = await createPage('/')
        // @ts-ignore
        const state = await page.evaluate(() => window.__NUXT__.state)

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
          const page = await createPage('/')
          await loginWithOidc(page)

          const {
            token,
            user,
            axiosBearer,
            idToken,
            refreshToken
          } = await getAuthDataFromWindow(page)

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
          const page = await createPage('/')
          await loginWithOidc(page)

          const {
            token: loginToken,
            idToken: loginIdToken,
            refreshToken: loginRefreshToken,
            user: loginUser,
            axiosBearer: loginAxiosBearer
          } = await getAuthDataFromWindow(page)

          expect(loginAxiosBearer).toBeDefined()
          expect(loginAxiosBearer.split(' ')).toHaveLength(2)
          expect(loginAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
          expect(loginToken).toBeDefined()
          expect(loginIdToken).toBeDefined()
          expect(loginRefreshToken).toBeDefined()
          expect(loginUser).toBeDefined()
          expect(loginUser.sub).toBe('test_username')

          await page.evaluate(async () => {
            await window.$nuxt.$auth.refreshTokens()
          })

          const {
            token: refreshedToken,
            idToken: refreshedIdToken,
            refreshToken: refreshedRefreshToken,
            axiosBearer: refreshedAxiosBearer,
            user: refreshedUser
          } = await getAuthDataFromWindow(page)

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
          expect(refreshedUser).toBeDefined()
          expect(refreshedUser.sub).toBe('test_username')
        })

        test('logout', async () => {
          const page = await createPage('/')
          await loginWithOidc(page)

          const {
            token: loginToken,
            axiosBearer: loginAxiosBearer
          } = await getAuthDataFromWindow(page)

          expect(loginAxiosBearer).toBeDefined()
          expect(loginToken).toBeDefined()

          await logoutWithOidc(page)

          const {
            token: logoutToken,
            axiosBearer: logoutAxiosBearer
          } = await getAuthDataFromWindow(page)

          expect(logoutToken).toBeFalsy()
          expect(logoutAxiosBearer).toBeUndefined()
        })
      })
    })

    describe('Custom fixture', () => {
      setupTest({
        browser: true,
        configFile: 'nuxt.config.custom.js',
        config: {
          mode,
          server: {
            port
          }
        }
      })

      test("Default auth endpoints won't be overwritten by configuration document", async () => {
        const page = await createPage('/')
        await page.waitForFunction('!!window.$nuxt')
        await page.evaluate(
          async () =>
            await window.$nuxt.$auth.setStrategy('oidcAuthorizationCode')
        )
        await page.waitForTimeout(1000)
        const activeStrategy = await page.evaluate(() => {
          const strategy = (window.$nuxt.$auth
            .strategy as unknown) as OpenIDConnectScheme
          return {
            name: strategy.name,
            userInfoEndpoint: strategy.options.endpoints.userInfo,
            logoutRedirectUri: strategy.options.logoutRedirectUri
          }
        })
        expect(activeStrategy.name).toEqual('oidcAuthorizationCode')
        expect(activeStrategy.logoutRedirectUri).toEqual(
          'http://localhost:4000'
        )
        expect(activeStrategy.userInfoEndpoint).toEqual('/something/random')
      })
    })
  })
})
