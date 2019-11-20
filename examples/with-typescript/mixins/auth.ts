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
    await this.$auth.logout().then(() => {
      this.$toast.success('Successfully disconnected')
    }).catch(err => {
      this.$toast.error('Error while disconnecting: ' + err.message)
    })

    // If you are not fond of using axios promises on async calls
    // You can still use Javascript try and catch block
    //
    // try {
    //   this.$toast.show('Logging out...')
    //   await this.$auth.logout()
    //   this.$toast.success('Successfully disconnected')
    // } catch (err) {
    //   this.$toast.error('Error while disconnecting: ' + err.message)
    // }
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
    await this.$auth.login({
      data: {
        username: this.username,
        password: this.password
      }
    }).then(() => {
      this.$toast.success('Successfully connected')
    }).catch(err => {
      this.$toast.error('Error while disconnecting: ' + err.message)
      this.loginHasError = true
    })
  }
}
