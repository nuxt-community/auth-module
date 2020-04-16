import { routeOption } from '../utils'
import SessionPlugin from './Session'

export default class Auth {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    this.registerPlugin('session', SessionPlugin)
  }

  registerPlugin (name, Constructor, options) {
    const $name = '$' + name

    // Check if plugin already registred
    if (this[$name]) {
      throw new Error(`Plugin ${name} already registred.`)
    }

    // Load options by default from options[name]
    if (options === undefined) {
      options = this.options[name]
    }

    // Check if plugin is disabled
    if (options === false) {
      return
    }

    // Create new instance
    const instance = new Constructor(this, options)

    // Register
    this[$name] = instance
  }

  async init () {
    // Reset on error
    if (this.options.resetOnError) {
      this.onError((...args) => {
        if (typeof (this.options.resetOnError) !== 'function' || this.options.resetOnError(...args)) {
          this.reset()
        }
      })
    }

    // Restore strategy
    this.$storage.syncUniversal('strategy', this.options.defaultStrategy)

    // Set default strategy if current one is invalid
    if (!this.strategy) {
      this.$storage.setUniversal('strategy', this.options.defaultStrategy)

      // Give up if still invalid
      if (!this.strategy) {
        return Promise.resolve()
      }
    }

    try {
      // Call mounted for active strategy on initial load
      await this.mounted()
    } catch (error) {
      this.callOnError(error)
    } finally {
      // Watch for loggedIn changes only in client side
      if (process.client && this.options.watchLoggedIn) {
        this.$storage.watchState('loggedIn', loggedIn => {
          if (!routeOption(this.ctx.route, 'auth', false)) {
            this.redirect(loggedIn ? 'home' : 'logout')
          }
        })
      }
    }
  }

  mounted () {
    if (!this.strategy.mounted) {
      return this.fetchUserOnce()
    }

    return Promise.resolve(this.strategy.mounted(...arguments)).catch(error => {
      this.callOnError(error, { method: 'mounted' })
      return Promise.reject(error)
    })
  }

  setUserToken (token) {
    if (!this.strategy.setUserToken) {
      this.token.set(token)
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.setUserToken(token)).catch(error => {
      this.callOnError(error, { method: 'setUserToken' })
      return Promise.reject(error)
    })
  }

  reset () {
    if (!this.strategy.reset) {
      this.setUser(false)
      this.token.reset()
      this.refreshToken.reset()
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.reset(...arguments)).catch(error => {
      this.callOnError(error, { method: 'reset' })
      return Promise.reject(error)
    })
  }

  refreshTokens () {
    if (!this.strategy.refreshController) {
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.refreshController.handleRefresh()).catch(error => {
      this.callOnError(error, { method: 'refreshTokens' })
      return Promise.reject(error)
    })
  }

  addTokenPrefix (token) {
    return this.options.token_type ? this.options.token_type + ' ' + token : token
  }

  get user () {
    return this.$state.user
  }

  get loggedIn () {
    return this.$state.loggedIn
  }

  setUser (user) {
    this.$storage.setState('user', user)
    this.$storage.setState('loggedIn', Boolean(user))
  }

  get busy () {
    return this.$storage.getState('busy')
  }
}
