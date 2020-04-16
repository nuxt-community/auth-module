import { AuthPlugin } from '../inc/AuthPlugin'

export default class UserPlugin extends AuthPlugin {
  loginWith (name, ...args) {
    return this.setStrategy(name).then(() => this.login(...args))
  }

  login () {
    if (!this.strategy.login) {
      return Promise.resolve()
    }

    return this.wrapLogin(this.strategy.login(...arguments))
      .catch(error => {
        this.callOnError(error, { method: 'login' })
        return Promise.reject(error)
      })
  }

  wrapLogin (promise) {
    this.$storage.setState('busy', true)
    this.error = null

    return Promise.resolve(promise)
      .then(response => {
        this.$storage.setState('busy', false)
        return response
      })
      .catch(error => {
        this.$storage.setState('busy', false)
        return Promise.reject(error)
      })
  }

  fetchUser () {
    if (!this.strategy.fetchUser) {
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.fetchUser(...arguments)).catch(error => {
      this.callOnError(error, { method: 'fetchUser' })
      return Promise.reject(error)
    })
  }

  logout () {
    if (!this.strategy.logout) {
      this.reset()
      return Promise.resolve()
    }

    return Promise.resolve(this.strategy.logout(...arguments)).catch(error => {
      this.callOnError(error, { method: 'logout' })
      return Promise.reject(error)
    })
  }

  fetchUserOnce () {
    if (!this.$state.user) {
      return this.fetchUser(...arguments)
    }
    return Promise.resolve()
  }
}
