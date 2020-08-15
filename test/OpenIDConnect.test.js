const path = require('path')
const { loadNuxt, build } = require('nuxt-edge')
const puppeteer = require('puppeteer')

const getAuthDataFromWindow = page =>
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

const loginWithOidc = async ({ page, port }) => {
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

const logoutWithOidc = async ({ page, port }) => {
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
  let browser
  const port = 3000
  const url = p => 'http://localhost:' + port + p

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    })
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('Default fixture', () => {
    let nuxt

    beforeAll(async () => {
      nuxt = await loadNuxt({
        for: 'dev',
        rootDir: path.resolve(__dirname, 'fixture'),
        configOverrides: {
          build: {
            terser: false
          }
        }
      })
      await build(nuxt)
      await nuxt.listen(port)
    }, 10 * 1000)

    afterAll(async () => {
      await nuxt.close()
    })

    test('initial state', async () => {
      const context = await browser.createIncognitoBrowserContext()
      const page = await context.newPage()
      await page.goto(url('/'))

      const state = await page.evaluate(() => window.__NUXT__.state)
      expect(state.auth).toEqual({
        user: null,
        loggedIn: false,
        strategy: 'local'
      })

      await page.close()
    })

    describe('Authorization Code Flow', () => {
      test('login', async () => {
        const context = await browser.createIncognitoBrowserContext()
        const page = await context.newPage()
        await page.goto(url('/'))
        await page.waitForFunction('!!window.$nuxt')

        await loginWithOidc({ page, port })

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

        await page.close()
      })

      test('refresh', async () => {
        const context = await browser.createIncognitoBrowserContext()
        const page = await context.newPage()
        await page.goto(url('/'))
        await page.waitForFunction('!!window.$nuxt')

        await loginWithOidc({ page, port })

        const {
          token: loginToken,
          idToken: loginIdToken,
          refreshToken: loginRefreshToken,
          expiresAt: loginExpiresAt,
          user: loginUser,
          axiosBearer: loginAxiosBearer
        } = await getAuthDataFromWindow(page)

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
        expect(refreshedExpiresAt).toBeDefined()
        expect(refreshedExpiresAt).toBeGreaterThanOrEqual(loginExpiresAt)
        expect(refreshedUser).toBeDefined()
        expect(refreshedUser.sub).toBe('test_username')

        await page.close()
      })

      test('logout', async () => {
        const page = await browser.newPage()
        await page.goto(url('/'))
        await page.waitForFunction('!!window.$nuxt')

        await loginWithOidc({ page, port })

        const {
          token: loginToken,
          axiosBearer: loginAxiosBearer
        } = await getAuthDataFromWindow(page)

        expect(loginAxiosBearer).toBeDefined()
        expect(loginToken).toBeDefined()

        await logoutWithOidc({ page, port })

        const {
          token: logoutToken,
          axiosBearer: logoutAxiosBearer
        } = await getAuthDataFromWindow(page)

        expect(logoutToken).toBeFalsy()
        expect(logoutAxiosBearer).toBeUndefined()

        await page.close()
      })
    })
  })

  describe('Custom fixture', () => {
    const loadFixture = async (config) => {
      const nuxt = await loadNuxt({
        for: 'dev',
        rootDir: path.resolve(__dirname, 'fixture'),
        configOverrides: {
          build: {
            terser: false
          },
          ...config
        }
      })
      await build(nuxt)
      await nuxt.listen(port)
      return nuxt
    }

    test('Default auth endpoints won\'t be overwritten by discovery document', async () => {
      const fixture = await loadFixture({
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
      })
      const context = await browser.createIncognitoBrowserContext()
      const page = await context.newPage()
      await page.goto(url('/'))
      await page.waitForFunction('!!window.$nuxt')

      await page.evaluate(async () => await window.$nuxt.$auth.setStrategy('oidcAuthorizationCode'))
      await page.waitFor(1000)
      const activeStrategy = await page.evaluate(async () => ({
        name: window.$nuxt.$auth.strategy.name,
        userInfoEndpoint: window.$nuxt.$auth.strategy.options.endpoints.userInfo,
        logoutRedirectUri: window.$nuxt.$auth.strategy.options.logoutRedirectUri
      }))

      expect(activeStrategy.name).toEqual('oidcAuthorizationCode')
      expect(activeStrategy.logoutRedirectUri).toEqual('http://localhost:4000')
      expect(activeStrategy.userInfoEndpoint).toEqual('/something/random')

      await page.close()
      await fixture.close()
    })
  })
})
