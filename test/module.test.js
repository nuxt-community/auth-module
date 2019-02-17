const { Nuxt, Builder } = require('nuxt-edge')
const puppeteer = require('puppeteer')

const config = require('./fixtures/basic/nuxt.config')

const url = path => `http://localhost:3000${path}`

const initNuxt = async (config) => {
  const instance = new Nuxt(config)
  await new Builder(instance).build()
  await instance.listen(process.env.PORT)
  return instance
}

const initBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
  })
}

describe('auth', () => {
  let nuxt
  let browser

  beforeAll(async () => {
    browser = await initBrowser()
    nuxt = await initNuxt(config)
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

describe('redirect when unauthorized', () => {
  let browser

  beforeAll(async () => { browser = await initBrowser() }, 60000)
  afterAll(async () => { await browser.close() })

  describe('redirection setting by string', () => {
    test('should redirect to login page', async () => {
      const redirect = { login: '/login?param=test1' }
      const nuxt = await initNuxt({
        ...config,
        ...{
          auth: { ...config.auth, ...{ redirect } }
        }
      })
      const page = await browser.newPage()
      await page.goto(url('/secure'))

      const currentUri = await page.evaluate(() => window.location.href)

      await page.close()
      await nuxt.close()

      expect(currentUri).toBe(url('/login?param=test1'))
    }, 60000)
  })

  describe('redirection setting by a function', () => {
    test('should redirect to login page', async () => {
      const redirect = { login: (ctx) => '/login?param=test2' }
      const nuxt = await initNuxt({
        ...config,
        ...{
          auth: { ...config.auth, ...{ redirect } }
        }
      })
      const page = await browser.newPage()
      await page.goto(url('/secure'))

      const currentUri = await page.evaluate(() => window.location.href)

      await page.close()
      await nuxt.close()

      expect(currentUri).toBe(url('/login?param=test2'))
    }, 60000)
  })
})
