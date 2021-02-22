import { setupTest, createPage } from '@nuxt/test-utils'
import { RefreshableScheme, TokenableScheme } from '../src'

describe('e2e', () => {
  setupTest({
    browser: true
  })

  test('initial state', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const state = await page.evaluate(() => window.__NUXT__.state)
    expect(state.auth).toEqual({
      user: null,
      loggedIn: false,
      strategy: 'local'
    })

    await page.close()
  })

  test('login', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const { token, user, axiosBearer, response } = await page.evaluate(
      async () => {
        const response = await window.$nuxt.$auth.loginWith('local', {
          data: { username: 'test_username', password: '123' }
        })
        const strategy = (window.$nuxt.$auth
          .strategy as unknown) as TokenableScheme

        return {
          axiosBearer:
            window.$nuxt.$axios.defaults.headers.common.Authorization,
          token: strategy.token.get(),
          user: window.$nuxt.$auth.user,
          response
        }
      }
    )

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
    const page = await createPage('/')
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
      const strategy = (window.$nuxt.$auth
        .strategy as unknown) as RefreshableScheme

      return {
        loginAxiosBearer:
          window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: strategy.token.get(),
        loginRefreshToken: strategy.refreshToken.get(),
        // @ts-ignore
        loginExpiresAt: strategy.token._getExpiration(),
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
      const strategy = (window.$nuxt.$auth
        .strategy as unknown) as RefreshableScheme

      return {
        refreshedAxiosBearer:
          window.$nuxt.$axios.defaults.headers.common.Authorization,
        refreshedToken: strategy.token.get(),
        refreshedRefreshToken: strategy.refreshToken.get(),
        // @ts-ignore
        refreshedExpiresAt: strategy.token._getExpiration(),
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
    expect(refreshedExpiresAt).toBeGreaterThanOrEqual(loginExpiresAt as number)
    expect(refreshedUser).toBeDefined()
    expect(refreshedUser.username).toBe('test_username')
    expect(refreshedResponse).toBeDefined()

    await page.close()
  })

  test('logout', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const { loginAxiosBearer, loginToken } = await page.evaluate(async () => {
      await window.$nuxt.$auth.loginWith('local', {
        data: { username: 'test_username', password: '123' }
      })

      const strategy = (window.$nuxt.$auth
        .strategy as unknown) as TokenableScheme

      return {
        loginAxiosBearer:
          window.$nuxt.$axios.defaults.headers.common.Authorization,
        loginToken: strategy.token.get()
      }
    })

    expect(loginAxiosBearer).toBeDefined()
    expect(loginToken).toBeDefined()

    const { logoutToken, logoutAxiosBearer } = await page.evaluate(async () => {
      await window.$nuxt.$auth.logout()

      const strategy = (window.$nuxt.$auth
        .strategy as unknown) as TokenableScheme

      return {
        logoutAxiosBearer:
          window.$nuxt.$axios.defaults.headers.common.Authorization,
        logoutToken: strategy.token.get()
      }
    })

    expect(logoutToken).toBeFalsy()
    expect(logoutAxiosBearer).toBeUndefined()

    await page.close()
  })

  test('auth plugin', async () => {
    const page = await createPage('/')

    const flag = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return window.$nuxt.$auth._custom_plugin
    })

    expect(flag).toBe(true)

    await page.close()
  })
})
