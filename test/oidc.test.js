const path = require('path')
const { loadNuxt } = require('nuxt-edge')
const puppeteer = require('puppeteer')
const getPort = require('get-port')
const oidcmockserver = require('../demo/api/oidcmockserver')

const getAuthDataFromWindow = page => page.evaluate(async () => {
  return {
    axiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
    token: window.$nuxt.$auth.strategy.token.get(),
    expiresAt: window.$nuxt.$auth.strategy.token._getExpiration(),
    idToken: window.$nuxt.$auth.strategy.idToken.get(),
    refreshToken: window.$nuxt.$auth.strategy.refreshToken.get(),
    user: window.$nuxt.$auth.user
  }
})

const loginWithOidc = async (page) => {
  await page.evaluate(async () => {
    await window.$nuxt.$auth.loginWith('oidcmock')
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
  expect(page.url()).toContain('http://localhost:3000/callback')

  // Redirect to home
  await page.waitForFunction('!!window.$nuxt')
  expect(page.url()).toContain('http://localhost:3000')

  return getAuthDataFromWindow(page)
}

describe('oidc', () => {
  let url, nuxt, browser

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    })

    const port = 3000 // await getPort()

    // nuxt = await loadNuxt({
    //   for: 'start',
    //   rootDir: path.resolve(__dirname, 'fixture'),
    //   configOverrides: {
    //     serverMiddleware: [{ path: '/oidc', handler: (req, res) => oidcmockserver(req, res, getPort) }],
    //     auth: {
    //       strategies: {
    //         oidcmock: {
    //           scheme: 'oidc',
    //           baseURL: `http://localhost:${getPort}/oidc`,
    //           responseType: 'code',
    //           scope: ['openid', 'profile', 'offline_access'],
    //           grantType: 'authorization_code',
    //           clientId: 'nuxt_auth_oidc_client',
    //           logoutRedirectUri: `http://localhost:${getPort}`
    //         }
    //       }
    //     }
    //   }
    // })

    url = p => 'http://localhost:' + port + p
    // await nuxt.listen(port)
  })

  afterAll(async () => {
    await browser.close()
    // await nuxt.close()
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

  test('login', async () => {
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const { token, user, axiosBearer, idToken, refreshToken } = await loginWithOidc(page)

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

    const {
      token: loginToken,
      idToken: loginIdToken,
      refreshToken: loginRefreshToken,
      expiresAt: loginExpiresAt,
      user: loginUser,
      axiosBearer: loginAxiosBearer
    } = await loginWithOidc(page)

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

  // test('logout', async () => {
  //   const page = await browser.newPage()
  //   await page.goto(url('/'))
  //   await page.waitForFunction('!!window.$nuxt')

  //   const { loginAxiosBearer, loginToken } = await page.evaluate(async () => {
  //     await window.$nuxt.$auth.loginWith('oidcmock', {
  //       data: { username: 'test_username', password: '123' }
  //     })

  //     return {
  //       loginAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
  //       loginToken: window.$nuxt.$auth.strategy.token.get()
  //     }
  //   })

  //   expect(loginAxiosBearer).toBeDefined()
  //   expect(loginToken).toBeDefined()

  //   const { logoutToken, logoutAxiosBearer } = await page.evaluate(async () => {
  //     await window.$nuxt.$auth.logout()

  //     return {
  //       logoutAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
  //       logoutToken: window.$nuxt.$auth.strategy.token.get()
  //     }
  //   })

  //   expect(logoutToken).toBeFalsy()
  //   expect(logoutAxiosBearer).toBeUndefined()

  //   await page.close()
  // })

  // test('auth plugin', async () => {
  //   const page = await browser.newPage()
  //   await page.goto(url('/'))

  //   const flag = await page.evaluate(() => {
  //     return window.$nuxt.$auth._custom_plugin
  //   })

  //   expect(flag).toBe(true)

  //   await page.close()
  // })
})
