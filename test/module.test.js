const { Nuxt, Builder } = require('nuxt-edge')
const puppeteer = require('puppeteer')

const config = require('./fixtures/basic/nuxt.config')

const url = path => `http://localhost:3000${path}`

describe('auth', () => {
  let nuxt
  let browser

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    })

    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(process.env.PORT)
  }, 60000)

  afterAll(async () => {
    await browser.close()
    await nuxt.close()
  })

  test('initial state', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))

    const state = await page.evaluate(() => window.__NUXT__.state)
    expect(state.auth).toEqual({ user: null, loggedIn: false, strategy: 'local' })

    await page.close()
  })

  test('login', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const { token, user, axiosBearer } = await page.evaluate(async () => {
      await window.$nuxt.$auth.loginWith('local', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        axiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        token: window.$nuxt.$auth.getToken('local'),
        user: window.$nuxt.$auth.user
      }
    })

    expect(axiosBearer).toBeDefined()
    expect(axiosBearer.split(' ')).toHaveLength(2)
    expect(axiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
    expect(token).toBeDefined()
    expect(user).toBeDefined()
    expect(user.username).toBe('test_username')

    await page.close()
  })

  test('refresh', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const {
      loginToken,
      loginRefreshToken,
      loginExpiresAt,
      loginClientId,
      loginUser,
      loginAxiosBearer
    } = await page.evaluate(async () => {
      await window.$nuxt.$auth.loginWith('localRefresh', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        loginAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: window.$nuxt.$auth.getToken('localRefresh'),
        loginRefreshToken: window.$nuxt.$auth.getRefreshToken('localRefresh'),
        loginExpiresAt: window.$nuxt.$auth.strategy._getTokenExpiration(),
        loginClientId: window.$nuxt.$auth.strategy._getClientId(),
        loginUser: window.$nuxt.$auth.user
      }
    })

    expect(loginAxiosBearer).toBeDefined()
    expect(loginAxiosBearer.split(' ')).toHaveLength(2)
    expect(loginAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
    expect(loginToken).toBeDefined()
    expect(loginRefreshToken).toBeDefined()
    expect(loginExpiresAt).toBeDefined()
    expect(loginClientId).toBe(123)
    expect(loginUser).toBeDefined()
    expect(loginUser.username).toBe('test_username')

    const {
      refreshedToken,
      refreshedRefreshToken,
      refreshedExpiresAt,
      refreshedAxiosBearer,
      refreshedClientId,
      refreshedUser
    } = await page.evaluate(async () => {
      await window.$nuxt.$auth.refreshToken()

      return {
        refreshedAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        refreshedToken: window.$nuxt.$auth.getToken('localRefresh'),
        refreshedRefreshToken: window.$nuxt.$auth.getRefreshToken('localRefresh'),
        refreshedExpiresAt: window.$nuxt.$auth.strategy._getTokenExpiration(),
        refreshedClientId: window.$nuxt.$auth.strategy._getClientId(),
        refreshedUser: window.$nuxt.$auth.user
      }
    })

    expect(refreshedAxiosBearer).toBeDefined()
    expect(refreshedAxiosBearer.split(' ')).toHaveLength(2)
    expect(refreshedAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
    expect(refreshedAxiosBearer).not.toEqual(loginAxiosBearer)
    expect(refreshedToken).toBeDefined()
    expect(refreshedToken).not.toEqual(loginToken)
    expect(refreshedRefreshToken).toBeDefined()
    expect(refreshedRefreshToken).not.toEqual(loginRefreshToken)
    expect(refreshedExpiresAt).toBeDefined()
    expect(refreshedExpiresAt).toBeGreaterThan(loginExpiresAt)
    expect(refreshedClientId).toBe(123)
    expect(refreshedUser).toBeDefined()
    expect(refreshedUser.username).toBe('test_username')

    await page.close()
  })

  test('logout', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const { loginAxiosBearer, loginToken } = await page.evaluate(async () => {
      await window.$nuxt.$auth.loginWith('local', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        loginAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: window.$nuxt.$auth.getToken()
      }
    })

    expect(loginAxiosBearer).toBeDefined()
    expect(loginToken).toBeDefined()

    const { logoutToken, logoutAxiosBearer } = await page.evaluate(async () => {
      await window.$nuxt.$auth.logout()

      return {
        logoutAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        logoutToken: window.$nuxt.$auth.getToken()
      }
    })

    expect(logoutToken).toBeNull()
    expect(logoutAxiosBearer).toBeUndefined()

    await page.close()
  })

  test('auth plugin', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))

    const flag = await page.evaluate(async () => {
      return window.$nuxt.$auth._custom_plugin
    })

    expect(flag).toBe(true)

    await page.close()
  })
})
