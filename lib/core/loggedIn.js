export default class LoggedIn {
  constructor (auth) {
    this.$auth = auth
  }

  _setLoggedIn (loggedIn) {
    const _key = this.$auth.options.loggedIn.prefix + this.$auth.strategy.name

    return this.$auth.$storage.setUniversal(_key, loggedIn)
  }

  _syncLoggedIn () {
    const _key = this.$auth.options.loggedIn.prefix + this.$auth.strategy.name

    return this.$auth.$storage.syncUniversal(_key)
  }

  get () {
    const _key = this.$auth.options.loggedIn.prefix + this.$auth.strategy.name

    return this.$auth.$storage.getUniversal(_key)
  }

  set (loggedIn) {
    this._setLoggedIn(loggedIn)
    this.$auth.$storage.setState('loggedIn', loggedIn)

    return loggedIn
  }

  sync () {
    const loggedIn = this._syncLoggedIn()
    this.$auth.$storage.setState('loggedIn', loggedIn)

    return loggedIn
  }
}
