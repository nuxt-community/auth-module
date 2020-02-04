import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component
export default class AuthMixin extends Vue {

  /**
   * This define if login got an error
   * @type {boolean}
   */
  loginHasError = false

  /**
   * Logout method using auth-module with custom post-request
   * logic, using toast module to show information, success
   * and error messages.
   *
   * @returns {Promise<void>}
   */
  async logout () {

    this.$toast.show('Logging out...')
    try {
      await this.$auth.logout()
      this.$toast.success('Successfully disconnected')
    } catch(err) {
      this.$toast.error('Error while disconnecting: ' + err.message)
    }
  }

  /**
   * Login method using auth-module with custom post-request
   * logic, using toast module to show information, success
   * and error messages.
   *
   * @returns {Promise<T>}
   */
  async login() {
    this.$toast.show('Log in...')
    try {
      await this.$auth.login({
        data: {
          username: this.username,
          password: this.password
        }
      })
      this.$toast.success('Successfully connected')
    } catch(err) {
      this.$toast.error('Error while connecting: ' + err.message)
      this.loginHasError = true
    }
  }
}
