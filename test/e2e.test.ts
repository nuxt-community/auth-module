const util = require('util')
const exec = util.promisify(require('child_process').exec)
const {
  setup: setupDevServer,
  teardown: teardownDevServer
} = require('jest-dev-server')

const browserTimeout = 20 * 1000
const port = 3000
const url = p => 'http://localhost:' + port + p
const setup = async () => {
  await exec('yarn nuxt build test/fixture')
  await setupDevServer({
    command: 'yarn nuxt start test/fixture',
    port: 3000,
    launchTimeout: browserTimeout
  })
}

describe('e2e', () => {
  beforeAll(async () => {
    await setup()
  }, browserTimeout)

  beforeEach(async () => {
    await jestPuppeteer.resetBrowser()
  })

  afterAll(async () => {
    await teardownDevServer()
  })

  test('initial state', async () => {
    await page.goto(url('/'))

    // @ts-ignore
    const state = await page.evaluate(() => window.__NUXT__.state)
    expect(state.auth).toEqual({ user: null, loggedIn: false, strategy: 'local' })

    await page.close()
  })

  test('login', async () => {
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const { token, user, axiosBearer, response } = await page.evaluate(async () => {
      const response = await window.$nuxt.$auth.loginWith('local', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        axiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        token: window.$nuxt.$auth.strategy.token.get(),
        user: window.$nuxt.$auth.user,
        response
      }
    })

    expect(axiosBearer).toBeDefined()
    expect(axiosBearer.split(' ')).toHaveLength(2)
    expect(axiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
    expect(token).toBeDefined()
    expect(user).toBeDefined()
    expect(user.username).toBe('test_username')
    expect(response).toBeDefined()

    await page.close()
  })

  test('refresh', async () => {
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const {
      loginToken,
      loginRefreshToken,
      loginExpiresAt,
      loginUser,
      loginAxiosBearer,
      loginResponse
    } = await page.evaluate(async () => {
      const loginResponse = await window.$nuxt.$auth.loginWith('localRefresh', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        loginAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: window.$nuxt.$auth.strategy.token.get(),
        loginRefreshToken: window.$nuxt.$auth.strategy.refreshToken.get(),
        loginExpiresAt: window.$nuxt.$auth.strategy.token._getExpiration(),
        loginUser: window.$nuxt.$auth.user,
        loginResponse
      }
    })

    expect(loginAxiosBearer).toBeDefined()
    expect(loginAxiosBearer.split(' ')).toHaveLength(2)
    expect(loginAxiosBearer.split(' ')[0]).toMatch(/^Bearer$/i)
    expect(loginToken).toBeDefined()
    expect(loginRefreshToken).toBeDefined()
    expect(loginExpiresAt).toBeDefined()
    expect(loginUser).toBeDefined()
    expect(loginUser.username).toBe('test_username')
    expect(loginResponse).toBeDefined()

    const {
      refreshedToken,
      refreshedRefreshToken,
      refreshedExpiresAt,
      refreshedAxiosBearer,
      refreshedUser,
      refreshedResponse
    } = await page.evaluate(async () => {
      const refreshedResponse = await window.$nuxt.$auth.refreshTokens()

      return {
        refreshedAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        refreshedToken: window.$nuxt.$auth.strategy.token.get(),
        refreshedRefreshToken: window.$nuxt.$auth.strategy.refreshToken.get(),
        refreshedExpiresAt: window.$nuxt.$auth.strategy.token._getExpiration(),
        refreshedUser: window.$nuxt.$auth.user,
        refreshedResponse
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
    expect(refreshedExpiresAt).toBeGreaterThanOrEqual(loginExpiresAt)
    expect(refreshedUser).toBeDefined()
    expect(refreshedUser.username).toBe('test_username')
    expect(refreshedResponse).toBeDefined()

    await page.close()
  })

  test('logout', async () => {
    await page.goto(url('/'))
    await page.waitForFunction('!!window.$nuxt')

    const { loginAxiosBearer, loginToken } = await page.evaluate(async () => {
      await window.$nuxt.$auth.loginWith('local', {
        data: { username: 'test_username', password: '123' }
      })

      return {
        loginAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: window.$nuxt.$auth.strategy.token.get()
      }
    })

    expect(loginAxiosBearer).toBeDefined()
    expect(loginToken).toBeDefined()

    const { logoutToken, logoutAxiosBearer } = await page.evaluate(async () => {
      await window.$nuxt.$auth.logout()

      return {
        logoutAxiosBearer: window.$nuxt.$axios.defaults.headers.common.Authorization,
        logoutToken: window.$nuxt.$auth.strategy.token.get()
      }
    })

    expect(logoutToken).toBeFalsy()
    expect(logoutAxiosBearer).toBeUndefined()

    await page.close()
  })

  test('auth plugin', async () => {
    await page.goto(url('/'))

    const flag = await page.evaluate(() => {
      // @ts-ignore
      return window.$nuxt.$auth._custom_plugin
    })

    expect(flag).toBe(true)

    await page.close()
  })
})
