import { setupTest, createPage } from '@nuxt/test-utils'
import jwtDecode from 'jwt-decode'
import { LocalScheme } from '../src'
describe('expiry', () => {
  setupTest({
    browser: true
  })

  test('token expiry is decoded correctly', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const { expectedExpiryTime, evaluatedExpiryTime, loginResponse } =
      await page.evaluate(async () => {
        const expiryTime = Math.floor(Date.now() / 1000) - 1000
        window.$nuxt.$auth.strategies.local.options.user.autoFetch = false
        const loginResponse = await window.$nuxt.$auth.loginWith('local', {
          data: { username: 'test_username', password: '123', expiryTime }
        })

        const strategy =
          window.$nuxt.$auth.getStrategy() as unknown as LocalScheme

        return {
          loginResponse,
          expectedExpiryTime: expiryTime,
          // @ts-ignore
          evaluatedExpiryTime: strategy.token._getExpiration()
        }
      })

    const token = jwtDecode<{ exp: number }>(
      loginResponse.data.token.accessToken
    )
    expect(token.exp).toEqual(expectedExpiryTime)
    expect(evaluatedExpiryTime).toEqual(expectedExpiryTime * 1000)
  })
})
